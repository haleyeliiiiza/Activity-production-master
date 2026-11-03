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

`dashboard/index.html` is the hub page. It reads the sheet through the Claude Google Sheets connector, so it runs inside Claude (like the Finance Hub), not as a standalone web page.

| Tab | What it shows | Sheet tabs it reads |
|---|---|---|
| Dashboard | November goal, today's plan, this week vs. plan, next presentations, follow-ups, pipeline, call queue | all of the below |
| Monthly Plan | The plan from the sheet with live progress and a week-by-week table | November 20k ALP Plan, Tracker |
| Leads | Pipeline by status and lead type, searchable lead list | All Leads Master |
| Call list | Cohorts, next steps, filters by type, province, cohort and next step | Call Lists |
| Weekly schedule | Day-by-day plan, from today or all days, with script links | Weekly Schedule |
| Cadence | Text and call steps with what to do on no answer, interest or refusal | Cadence |
| Scripts | Text, call and objection scripts with copy buttons and draft flags | Scripts |
| Activity | Dials, conversations, bookings, presentations by day and power list, latest entries | Tracker |
| Stats | Running totals, conversion rates, daily dials and conversations | Stats |
| Production | ALP, policies and presentations against the $20k plan, weekly plan table | Tracker |

More tabs (Recruiting, Policies & Commissions) are planned; see [docs/ROADMAP.md](docs/ROADMAP.md). To add one, append it to `TABS` in the page, add a `<section id="p-NAME">` and a render function.

### Publishing the page

The sheet ID is not stored in this repo (the sheet is link-shared and holds client data), so the committed page has a `__SHEET_ID__` placeholder. Fill it in when publishing:

```bash
sed 's#__SHEET_ID__#<your sheet id>#' dashboard/index.html > /tmp/activity-hub.html
```

Publish that file as a Claude artifact with the Google Sheets connector (`get_values`) allowed.

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
