import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";

/**
 * Sanity webhook → on-demand revalidation.
 *
 * Sanity POSTs here whenever a `project` is published/edited/deleted, and we
 * bust the "projects" cache tag the homepage fetch is tagged with
 * (components/Projects.tsx). The gallery then reflects the change in seconds
 * instead of waiting out the hourly ISR window (app/page.tsx `revalidate`).
 *
 * Setup (one-time):
 *   1. Set env SANITY_REVALIDATE_SECRET to a random string.
 *   2. In sanity.io/manage → API → Webhooks, add a webhook:
 *        URL:     https://YOUR-SITE.com/api/revalidate
 *        Trigger: Create, Update, Delete
 *        Filter:  _type == "project"
 *        Secret:  same value as SANITY_REVALIDATE_SECRET
 *
 * The secret signs the request; without a matching signature we reject (401),
 * so the endpoint can't be used to force cache churn by a third party.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.SANITY_REVALIDATE_SECRET;
    if (!secret) {
      console.error(
        "[revalidate] SANITY_REVALIDATE_SECRET is not set — refusing to process webhook."
      );
      return NextResponse.json({ error: "Misconfigured." }, { status: 500 });
    }

    const { isValidSignature, body } = await parseBody<{ _type?: string }>(
      req,
      secret
    );

    if (!isValidSignature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    // "max" = stale-while-revalidate: serve stale instantly, refetch in the
    // background. The two-arg form is required in Next 16 (single-arg is
    // deprecated).
    revalidateTag("projects", "max");

    return NextResponse.json({
      revalidated: true,
      tag: "projects",
      type: body?._type,
    });
  } catch (err) {
    console.error("[revalidate] webhook handler threw:", err);
    return NextResponse.json({ error: "Revalidation failed." }, { status: 500 });
  }
}
