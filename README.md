# Ell Vii's Automations

Public website and separate CRM demo for Ell Vii's Automations.

## Files

- `index.html` — public sales website
- `crm-demo/index.html` — separate CRM demo portal
- `TWILIO_PHONE_WORKFLOW_NOTES.md` — internal Twilio phone workflow notes
- `.gitignore` — basic ignore file for future Node/Cloudflare/Netlify work

## Website positioning

**Websites that capture leads. CRM that protects them. Phone workflows that prevent missed opportunities.**

## CRM focus modes

1. Home Services
2. Beauty / Wellness
3. Restaurant / Hospitality
4. Housing / Rental

## Recommended GitHub Pages setup

Use the root folder as the published site.

Main website:
`/index.html`

CRM demo:
`/crm-demo/index.html`

## Production warning

The CRM demo uses browser localStorage and simulated Twilio events. A real production version needs:

- Authentication
- Database storage
- Twilio webhooks
- A2P 10DLC setup for SMS
- Opt-in / STOP / HELP language
- Role-based access
- Privacy policy and terms
