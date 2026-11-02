# Activity & Production Hub

Personal hub for life insurance sales: daily activity, lead and recruiting pipeline, policies issued and commissions, plus the n8n automations and daily report that keep it current. Built on the same pattern as the Finance Hub.

## How it fits together

```
Kixie (End Call, PowerDial) ─┐
Log form (n8n) ──────────────┼─► n8n workflows ─► Google Sheet "Master Lead/Activity Tracker" ─► Dashboards
Calendly bookings ───────────┤                       (single source of truth)
Manual entry ────────────────┘                                                              └─► 8 AM report email
```

- **Google Sheet** holds every activity, lead and policy. Layout: [docs/SHEET_SCHEMA.md](docs/SHEET_SCHEMA.md).
- **Dashboards** (`dashboard/`) read the sheet. Monthly goal dashboards live here; the hub dashboard has tabs Dashboard, Activity, Pipeline, Recruiting, Policies & Commissions.
- **n8n workflows** (`n8n/`) ingest Kixie, the log form and Calendly, and send the daily report. See [n8n/README.md](n8n/README.md).

## Hub tabs

| Tab | What it answers |
|---|---|
| Dashboard | Goal progress, pace, what is needed per day, this month vs. last |
| Activity | Dials, conversations, bookings, presentations, no-shows by day and by power list |
| Pipeline | Leads, follow-ups due, applications submitted, policies issued |
| Recruiting | Recruiting calls and interviews, kept separate from sales numbers |
| Policies & Commissions | Issued policies with ALP and expected commission, ready to feed income into the Finance Hub |

Status: the November 2026 $20k ALP dashboard exists (`dashboard/november-2026-20k-alp.html`). The other tabs are planned; see [docs/ROADMAP.md](docs/ROADMAP.md).

## November 2026 — $20k ALP

- **Live dashboard:** the Claude dashboard "November $20k ALP Dashboard" (opened from claude.ai). It reads the Master Lead/Activity Tracker Google Sheet live.
- **Source:** `dashboard/november-2026-20k-alp.html`. It runs inside the Claude dashboard runtime (`dash.*`), not as a standalone web page.
- **Plan defaults (editable on the dashboard):** $1,000 average ALP, 10% close rate, 47% show rate, 21 dials per conversation, 1 booking per conversation, Mon–Sat (25 workdays).

## Look and feel

Same as the Finance Hub: white background, dark forest-green palette.

| Token | Hex | Use |
|---|---|---|
| forest | `#1B3A2B` | headers, primary buttons |
| green | `#2F5D43` | accents, activity bars |
| sage | `#6F8F72` | secondary text, borders |
| mist | `#DCE6DB` | card fills, tab backgrounds |
| brass | `#B8934A` | highlights, goals and pace lines |

Fonts: Cormorant Garamond (headings), Figtree (UI).

## Privacy

Lead names, phone numbers and policy details are client data. Never commit exports, call logs or screenshots; they are git-ignored. This repo is currently public, so keep it to code and documentation only, or make it private before adding anything sensitive.
