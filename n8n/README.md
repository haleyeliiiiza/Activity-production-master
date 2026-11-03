# n8n workflows

All run on the n8n cloud account (America/Regina time zone).

## Lead & Activity Tracker

Workflow ID `oifhCUJNZSSW5rLc`. One workflow, four groups of steps. It writes to the `Tracker` tab that the Activity Hub reads.

| Group | Trigger | What it does |
|---|---|---|
| Log Kixie calls | Kixie End Call and PowerDial webhook (`/webhook/kixie-call`, header `X-Kixie-Secret`) | Adds a `Call` row, or `Recruiting Call` for lists marked Recruiting on the `Power Lists` tab. Unknown list IDs are added to `Power Lists` to be named. |
| Log form | n8n form `lead-activity-log` | Adds a row of any type: New Lead, Call, Appointment Set, Presentation Held, No-Show, Application Submitted (with ALP), Policy Issued, Follow-Up. Syncs the contact and a note to HubSpot. |
| Calendly | Calendly `invitee.created` | Adds an `Appointment Set` row and a HubSpot note. |
| Log Kixie texts | Kixie SMS webhook (`/webhook/kixie-sms`, same `X-Kixie-Secret` header) | Adds a `Text` row for each text you send and a `Text Reply` row for each reply, dated in Regina time, with the message in Notes. Incoming direction is assumed to start with "in" (Kixie sends "outgoing" for sent texts); confirm with a real reply. |
| Daily progress report | Every morning at 8 AM | Reads the `Tracker` tab, works out progress against the November $20k ALP plan and emails it. |

### Daily progress report

The report's **Calculate Progress** step is [calculate-progress.js](calculate-progress.js). It uses the same plan and counting rules as the dashboard's Nov 20k plan and Production tabs, so the email and the page agree:

- Pace is measured over the 21 weekdays of November, not 30 calendar days.
- It compares ALP to the weekly plan (16 / 16 / 16 / 19 presentations and 5 sales a week at $1,000 average) and says whether you are ahead or behind.
- It shows this week's presentations, sales and ALP against target, plus presentations held, no-shows, close rate, dials and conversations.
- Conversations are calls whose Notes start with `Connected`. Recruiting interviews are left out of bookings.
- It links to the Activity Hub.
- Outside November 2026 it falls back to an even pace across the month's weekdays and skips the weekly table.

The plan numbers are constants at the top of the code. When the next month's plan exists, change them there and in the dashboard page together.

Source is Tracker only. Dials and bookings that are only typed on the `Stats` tab are not in the email.

### Not stored here

The full workflow export contains the sheet ID and credential IDs, so it is not committed. Export it from n8n when needed.

## To do

- Add a dedupe Key and an Import log line to each flow.
