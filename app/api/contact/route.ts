import { NextResponse } from "next/server";
import { Resend } from "resend";
import { business } from "@/lib/content";

/**
 * Quote-request handler — delivers leads by email via Resend.
 *
 * Required env to actually send:
 *   RESEND_API_KEY   — your Resend API key (https://resend.com/api-keys)
 * Optional env:
 *   LEAD_TO_EMAIL    — where leads land (default: business.email)
 *   LEAD_FROM_EMAIL  — verified sender (default: Resend's onboarding sandbox,
 *                      which only delivers to the Resend account owner — set a
 *                      verified-domain sender before launch).
 *
 * Resilience: every valid lead is logged (structured) before send, so a
 * delivery failure still leaves the lead recoverable in the server/Vercel logs.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Lead = {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  at: string;
};

// Escape user-supplied values before interpolating into the HTML email so a
// stray < or & can't break layout (or inject markup).
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Brand-styled HTML lead email — an email-safe rendering of the site's
 * "Dark Editorial" look (tinted dark canvas, single warm amber accent,
 * condensed-uppercase display approximated with a narrow Arial stack since
 * webfonts like Oswald/Inter don't load in mail clients). Built with tables +
 * inline styles for client compatibility.
 *
 * The company replies simply by hitting Reply (the message's reply-to is set to
 * the lead's address); the buttons here are shortcuts to the same.
 */
function renderLeadEmail(lead: Lead): string {
  const firstName = esc(lead.name.split(" ")[0] || lead.name);
  const tel = `tel:${lead.phone.replace(/[^\d+]/g, "")}`;
  const mailto = `mailto:${lead.email}?subject=${encodeURIComponent(
    `Re: your ${business.name} quote request`
  )}`;
  const submitted = new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Edmonton",
  }).format(new Date(lead.at));

  const row = (label: string, valueHtml: string) => `
    <tr>
      <td style="padding:7px 0;color:#8a909a;width:96px;vertical-align:top;font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;font-size:11px;">${label}</td>
      <td style="padding:7px 0;color:#ffffff;font-family:Arial,sans-serif;font-size:14px;vertical-align:top;">${valueHtml}</td>
    </tr>`;

  const link = (href: string, text: string) =>
    `<a href="${href}" style="color:#f0a235;text-decoration:none;">${text}</a>`;

  return `<!doctype html>
<html lang="en">
<body style="margin:0;padding:0;background:#0a0e14;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#0a0e14;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#11161f;border:1px solid #2a3340;border-radius:16px;overflow:hidden;">
        <tr><td style="height:4px;background:#f0a235;font-size:0;line-height:0;">&nbsp;</td></tr>
        <tr><td style="padding:28px 32px 4px;">
          <div style="font-family:'Arial Narrow',Arial,sans-serif;text-transform:uppercase;letter-spacing:2px;font-size:12px;color:#f0a235;font-weight:bold;">New Quote Request</div>
          <div style="font-family:'Arial Narrow',Arial,sans-serif;text-transform:uppercase;font-size:30px;line-height:1.05;color:#ffffff;font-weight:bold;margin-top:8px;">${esc(lead.name)}</div>
          <div style="font-family:Arial,sans-serif;font-size:13px;color:#8a909a;margin-top:8px;">via the ${esc(business.name)} website</div>
        </td></tr>
        <tr><td style="padding:20px 32px 4px;">
          <table role="presentation" cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:10px;"><a href="${mailto}" style="display:inline-block;background:#f0a235;color:#0a0e14;font-family:Arial,sans-serif;font-weight:bold;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:999px;">Reply to ${firstName}</a></td>
            <td><a href="${tel}" style="display:inline-block;background:#1a212c;color:#ffffff;border:1px solid #2a3340;font-family:Arial,sans-serif;font-weight:bold;font-size:14px;text-decoration:none;padding:12px 22px;border-radius:999px;">Call ${esc(lead.phone)}</a></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:18px 32px 6px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${row("Phone", link(tel, esc(lead.phone)))}
            ${row("Email", link(mailto, esc(lead.email)))}
            ${row("Service", esc(lead.service))}
          </table>
        </td></tr>
        <tr><td style="padding:10px 32px 26px;">
          <div style="font-family:Arial,sans-serif;text-transform:uppercase;letter-spacing:1px;font-size:11px;color:#8a909a;margin-bottom:8px;">Project details</div>
          <div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#cfd3d9;background:#1a212c;border:1px solid #2a3340;border-radius:12px;padding:16px 18px;white-space:pre-wrap;">${esc(lead.message)}</div>
        </td></tr>
        <tr><td style="padding:16px 32px 28px;border-top:1px solid #2a3340;">
          <div style="font-family:Arial,sans-serif;font-size:12px;color:#6b7280;line-height:1.7;">Just hit <strong style="color:#cfd3d9;">Reply</strong> to respond — it goes straight to ${esc(lead.name)} (${esc(lead.email)}).<br>Submitted ${esc(submitted)}</div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a hidden checkbox real users can't see or tick. Bots that
  // auto-fill forms check it. (A text field was tried but browser autofill
  // populated it — silently dropping real leads — so a checkbox is used:
  // autofill never ticks an invisible checkbox.)
  // Silently accept and drop so the bot sees success and moves on.
  if (body.botcheck) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim();
  const service = String(body.service ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !phone || !email) {
    return NextResponse.json(
      { error: "Name, phone, and email are required." },
      { status: 422 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email." }, { status: 422 });
  }

  const lead = {
    name,
    phone,
    email,
    service: service || "(not specified)",
    message: message || "(none)",
    at: new Date().toISOString(),
  };

  // Backup of record — survives even if email delivery fails. Uses console.warn
  // (not log) so it's preserved in production builds where compiler.removeConsole
  // strips console.log (see next.config.ts).
  console.warn("[contact] new quote request:", lead);

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Misconfiguration: fail loudly rather than silently dropping the lead.
    console.error(
      "[contact] RESEND_API_KEY is not set — lead was logged but NOT emailed. " +
        "Set RESEND_API_KEY (and optionally LEAD_TO_EMAIL / LEAD_FROM_EMAIL) to enable delivery."
    );
    return NextResponse.json(
      { error: "We couldn't submit the form right now." },
      { status: 503 }
    );
  }

  const to = process.env.LEAD_TO_EMAIL || business.email;
  const from =
    process.env.LEAD_FROM_EMAIL ||
    `${business.name} <onboarding@resend.dev>`;

  const text = [
    `New quote request from the ${business.name} website`,
    "",
    `Name:    ${lead.name}`,
    `Phone:   ${lead.phone}`,
    `Email:   ${lead.email}`,
    `Service: ${lead.service}`,
    "",
    "Project details:",
    lead.message,
    "",
    `Submitted: ${lead.at}`,
  ].join("\n");

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New quote request — ${name}`,
      text,
      html: renderLeadEmail(lead),
    });

    if (error) {
      console.error("[contact] Resend returned an error:", error);
      return NextResponse.json(
        { error: "We couldn't send your request. Please call us instead." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[contact] email delivery threw:", err);
    return NextResponse.json(
      { error: "We couldn't send your request. Please call us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
