# Activity & Production

Planning and tracking for life insurance sales production.

## November 2026 — $20k ALP

- **Live dashboard:** the Claude dashboard "November $20k ALP Dashboard" (opened from claude.ai). It reads the Master Lead/Activity Tracker Google Sheet live.
- **Source:** `dashboards/november-2026-20k-alp.html` is the dashboard page. It runs inside the Claude dashboard runtime (`dash.*`), not as a standalone web page.

### Data flow
1. **Kixie** (End Call + PowerDial Attempts webhooks) → n8n *Lead & Activity Tracker* → `Tracker` tab (Type `Call` for lead lists, `Recruiting Call` for lists marked Recruiting in the `Power Lists` tab).
2. **Log form** (n8n) → New Lead, Appointment Set, Presentation Held, No-Show, Application Submitted (with ALP), Policy Issued, Follow-Up.
3. **Calendly** bookings → Appointment Set (recruiting interviews are excluded from sales bookings on the dashboard).
4. Every morning at 8 AM (America/Regina) n8n emails a progress report.

### Plan defaults (editable on the dashboard)
$1,000 average ALP · 10% close rate · 47% show rate · 21 dials per conversation · 1 booking per conversation · Mon–Sat (25 workdays).
