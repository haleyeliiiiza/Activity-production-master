# n8n workflows

All run on the n8n cloud account (America/Regina time zone).

## Lead & Activity Tracker

Workflow ID `oifhCUJNZSSW5rLc`. One workflow, four groups of steps. It writes to the `Tracker` tab that the Activity Hub reads.

| Group | Trigger | What it does |
|---|---|---|
| Log Kixie calls | Kixie End Call and PowerDial webhook (`/webhook/kixie-call`, header `X-Kixie-Secret`) | Adds a `Call` row, or `Recruiting Call` for lists marked Recruiting on the `Power Lists` tab. Unknown list IDs are added to `Power Lists` to be named. |
| Log form | n8n form `lead-activity-log` | Adds a row of any type: New Lead, Call, Appointment Set, Presentation Held, No-Show, Application Submitted (with ALP), Policy Issued, Follow-Up. Syncs the contact and a note to HubSpot. |
| Calendly | Calendly `invitee.created` and `invitee.canceled` | A booking adds an `Appointment Set` row (with Appointment Time and Booking ID) and a HubSpot note. A cancellation or reschedule adds a `Booking Canceled` row with the same Booking ID. |
| Log Kixie texts | Kixie SMS webhook (`/webhook/kixie-sms`, same `X-Kixie-Secret` header) | Adds a `Text` row for each text you send and a `Text Reply` row for each reply, dated in Regina time, with the message in Notes. Kixie sends `direction` as "outgoing" or "incoming" (both confirmed with real texts). `messageDate` is ISO with a Z on sent texts and `yyyy-MM-dd HH:mm:ss` UTC on received ones; both are handled. |
| Appointment outcomes | Opened from a link: GET `/webhook/appt-outcome?booking=<Booking ID>`, then a button tap POSTs to `/webhook/appt-outcome-save` | Shows the appointment with **Presentation held** and **No-show** buttons. A tap adds a `Presentation Held` or `No-Show` row with the same Booking ID and Appointment Time. It refuses unknown, canceled and already-logged bookings, so a double tap cannot log twice. The booking ID in the link is the only credential. |
| Lead import | Every morning at 7 AM | Adds new leads from the `Lead Import` tab (written by Muse) to the `Leads` tab, skipping any lead whose phone number (last 10 digits) is already there. Also contains a one-time webhook (`/webhook/migrate-lead-tabs`) that merged All Leads Master and Call Lists into `Leads`; it does nothing once `Leads` has data. |
| Text drafting and approval | At 9 AM, 1 PM, 3 PM and 5 PM (start of each call block); approval page opened from the email | Drafts the texts that are due (first text for new leads, follow-up after a no-answer call, call-control text, booking reminder), saves them to `Text Queue` and emails an approval link. The page (`/webhook/text-approval?batch=...`) shows each text with a checkbox; approving records each one as `Dry run`, `Skipped` or `Expired`. Rules in `Text Settings`, wording in `Scripts`. **Nothing is sent to Kixie yet.** |
| Daily progress report | Every morning at 8 AM | Reads the `Tracker` tab, works out progress against the November $20k ALP plan and emails it. |

### Daily progress report

The report's **Calculate Progress** step is [calculate-progress.js](calculate-progress.js). It uses the same plan and counting rules as the dashboard's Nov 20k plan and Production tabs, so the email and the page agree:

- Pace is measured over the 21 weekdays of November, not 30 calendar days.
- It compares ALP to the weekly plan (16 / 16 / 16 / 19 presentations and 5 sales a week at $1,000 average) and says whether you are ahead or behind.
- It shows this week's presentations, sales and ALP against target, plus presentations held, no-shows, close rate, dials and conversations.
- Conversations are calls whose Notes start with `Connected`. Recruiting interviews are left out of bookings.
- It lists appointments from the last 14 days that have started and have no outcome, each with a link to the outcome page. An appointment counts as done when an outcome row has its Booking ID, or (older manual entries) matches its email, phone or name on or after the appointment day.
- It links to the Activity Hub.
- Outside November 2026 it falls back to an even pace across the month's weekdays and skips the weekly table.

The plan numbers are constants at the top of the code. When the next month's plan exists, change them there and in the dashboard page together.

Source is Tracker only. The old Stats tab no longer exists.

### Automatic texting

- A lead is skipped if it opted out (a reply containing stop, unsubscribe, not interested, wrong number and similar), replied since our last text, is booked, is stopped or unreachable, or already has a draft or text today. Texts only go out inside the lead's call block (Regina time), and a batch expires at the end of the day.
- Sending through Kixie is the next step: the plan is a POST to Kixie's Send SMS API (`apig.kixie.com/app/event`, event `sms`) with the API key held as an n8n credential. Until it is connected, approving only records a dry run.
- Each batch link carries a random code; anyone with the link could approve that batch, so do not forward the email.

### Not stored here

The full workflow export contains the sheet ID and credential IDs, so it is not committed. Export it from n8n when needed.

### Notes

- Google Sheets read steps run once per incoming row. Any read step that follows a step with many rows must have "Execute once" turned on, or it repeats the whole read for every row.

- Every step that adds a row to the Tracker uses the Sheets append API (`useAppend`). Without it, two entries logged at the same moment could land on the same row and one would be lost. This matters for PowerDialer bursts.
- HubSpot steps use HTTP Request nodes with the `HubSpot account` credential, so that credential must be allowed in HTTP Request nodes. n8n's built-in HubSpot node cannot create notes or phone-only contacts.
- The phone lookup matches HubSpot's normalized phone number (the last 10 digits), so `+13069808654`, `13069808654` and `(306) 980-8654` all find the same contact. It falls back to the exact number and picks the oldest matching contact.

## To do

- Add a dedupe Key and an Import log line to each flow.


## Stage-based texting

Text drafting reads the **Stage** column on the Leads tab. Stage 0 leads get a first text on text days only (Text Settings: First text days), version A or B for the first-text test. Stage 2 leads get a follow-up text after every 10 dials since their last text (Text Settings: Texts after every N dials), counted from the dated call history on the Leads tab plus Leads power-list dials in the Tracker. Follow-ups are drafted on text days only. Stages 3 (Booked), 4 (Missed) and 5 (Closed) get no cadence texts (booked leads still get reminders). Approved drafts are sent through Kixie's Send SMS API once Dry run is No; the Kixie API key is held as a Query Auth credential in n8n.

Call control: a lead whose call is dispositioned Call Control is treated as Stage 5 (Closed) by the hub and the text drafting. There is no call control text.

## Weekly schedule planner

Every Sunday at 6 PM Regina time the planner reads your Google Calendar for the coming Monday to Saturday, treats every event as busy (plus a buffer), and fits call blocks into the free time inside the lead call blocks (ON Will Kit, ON other / AB / SK, BC). It caps calling at the daily and weekly hours in Text Settings (`Plan:` rows), writes the plan to the `## Weekly schedule` section at the bottom of the Playbook tab, adds each call block to the calendar as a free (not busy) event described with `[Planner]` so Calendly can still book you, and emails the week. Re-running replaces the previous run's calendar events. Text days (`First text days`) get approval reminders instead of call blocks. To plan on demand, open the `plan-week` webhook (add `?start=YYYY-MM-DD` for a specific week).

Plan on demand: `plan-week` accepts `?start=YYYY-MM-DD` (any day in the week), `&weeks=2` (up to 4 weeks) and `&from=YYYY-MM-DD` (skip days before this date; defaults to today). Each run replaces the schedule section and the planner's calendar events.

## Daily call list email

Monday to Saturday at 7:30 AM Regina time the `Daily Call List Time` trigger emails today's plan (read from the Playbook schedule, including presentations) and a call list for each planned call block: Stage 1 and 2 leads whose Best Call Block matches, replies first, then Stage 1, then the longest since their last dial, up to 25 per block, with dials, progress toward the next text and the lead's reply. Missed presentations (Stage 4) are listed for one reschedule call; opt-outs and call control leads are left out. Open `daily-list` (with an optional `?date=YYYY-MM-DD`) to send it on demand.
