# Contact form — lead delivery setup

The quote form (`components/Contact.tsx`) posts same-origin to the API route
`app/api/contact/route.ts`, which delivers the lead by email via **Resend**.

Server-side delivery is deliberate:
- The form posts to our own `/api/contact` (same origin) — antivirus/browser
  heuristics flag client-side forms that POST directly to a third-party domain
  as phishing, so we never do that.
- Resend's API accepts server-side requests (unlike some form relays that sit
  behind Cloudflare bot protection and 403 any non-browser request).

## Why not Web3Forms / client-side relays?

Tried and rejected: Web3Forms only works when submitted from the browser
(Cloudflare blocks server-side calls with a 403 challenge), and a browser form
posting to `api.web3forms.com` gets flagged by Windows Defender as
`Trojan:HTML/FakeLogin`. Resend avoids both problems.

## One-time setup (do this as the CLIENT)

Register as the client so the account/key belong to them, not the builder.

1. Sign up at <https://resend.com> using the inbox where leads should land —
   `diamondconcretesealing@gmail.com`.
2. Verify that email (Resend's signup confirmation).
3. Create an API key → copy it.
4. Add the env var:
   - **Local:** `.env.local` → `RESEND_API_KEY=re_xxxxxxxx`
   - **Production:** Vercel → Project → Settings → Environment Variables →
     add `RESEND_API_KEY`
5. Redeploy.

That's it for the free, no-domain path. With no verified domain, Resend sends
from its sandbox sender `onboarding@resend.dev`, which **only delivers to the
Resend account owner's email** — i.e. the same Gmail you signed up with, which
is exactly where leads go. Customer replies work (the route sets reply-to to
the lead's email).

## Optional — verified domain (better deliverability)

If the client owns a domain (e.g. `diamondconcretesealing.ca`):
1. Add the domain in Resend → add the DNS records it shows (SPF/DKIM).
2. Set `LEAD_FROM_EMAIL=Diamond Concrete Sealing <quotes@yourdomain.ca>`.

Removes the sandbox single-recipient limit and keeps mail out of spam.

## Env vars

| Var | Required | Purpose |
|-----|----------|---------|
| `RESEND_API_KEY` | yes | Resend API key; missing → form returns 503 and logs a loud error |
| `LEAD_TO_EMAIL` | no | Override lead destination (default: `business.email`) |
| `LEAD_FROM_EMAIL` | no | Verified-domain sender (default: Resend sandbox, owner-only) |

Free tier: 3,000 emails/month, 100/day — far more than a quote form needs.
