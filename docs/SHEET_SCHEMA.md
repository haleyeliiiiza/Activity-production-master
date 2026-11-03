# Activity Hub sheet layout

Sheet: **Master Lead/Activity Tracker** (private Google Sheet, 11 tabs). The sheet ID is deliberately not stored in this repo: it is public, and the sheet holds client names and phone numbers. Keep the ID in the n8n credentials and the Claude dashboard.

Checked against the live sheet on 2026-11-02.

## Tab: Tracker (activity source of truth, written by n8n)

Header row, A to L:

| Col | Header | Notes |
|---|---|---|
| A | Date | YYYY-MM-DD |
| B | Type | `Call`, `Recruiting Call`, `New Lead`, `Appointment Set`, `Presentation Held`, `No-Show`, `Application Submitted`, `Policy Issued`, `Follow-Up`, `Text` (sent, from Kixie), `Text Reply` (received, from Kixie), `Booking Canceled` (from Calendly, including reschedules); `Presentation Held` and `No-Show` also come from the outcome link, with the booking's Appointment Time and Booking ID |
| C | Name | Lead name |
| D | Phone | |
| E | Email | |
| F | Premium | ALP in dollars, on `Application Submitted` rows |
| G | Source | `Kixie`, `Form`, `Calendly` |
| H | Notes | Kixie rows: `<disposition> \| <direction> \| <duration> \| <disposed?> \| <recording link>`. A disposition starting `Connected` is a real conversation; `No answer`, voicemail and call control are not. Contains `interview` for recruiting interviews |
| I | Power List ID | Kixie list ID |
| J | Power List | List name, matching `Power Lists` column B |
| K | Appointment Time | `yyyy-MM-dd HH:mm` in Regina time, on Calendly `Appointment Set` and `Booking Canceled` rows |
| L | Booking ID | Calendly invitee ID, shared by a booking and its cancellation |

The November dashboard reads Date/Type and Premium/Notes/Power List as separate ranges and joins them by sheet row number, so do not sort the tab or insert rows mid-sheet.

## Tab: Lead Import (written by Muse)

Muse collects leads from the two Planet ALTIG inboxes (**Haley Walker** and **Melanie Knox**) and adds one row per lead. Headers in row 1: Lead Type, Name, Province, Phone, Email, Sponsor, Beneficiary, Inbox, Date Collected. Email, Sponsor and Beneficiary are blank for lead types that do not have them. The Phone column is formatted as plain text; a number that starts with `+` must be written with a leading apostrophe or Sheets turns it into a formula error.

Every morning at 7 AM Regina time n8n adds new rows to **Leads**. A lead is new when the last 10 digits of its phone number are not already on Leads (leads with no phone are matched on name and type, and noted "No phone number: review"). Existing leads are never changed, and importing the same row twice adds nothing.

## Tab: Leads (the lead list the hub reads)

One row per lead. Columns: Lead Type, Name, Phone, Province, Email, Sponsor, Beneficiary, Lead Inbox, Date Added, Outcome, Next Step, Cohort, Best Call Block, Presentation Date, Notes, Dials (history), Texts (history), Call Dates (history), Text Dates (history).

- **Stage** (column T) is the lead's place in the cycle: 0 Not contacted, 1 Text sent, 2 Called, 3 Presented / Booked, 4 Closed. It was set on 2026-11-02 (leads with 4 or more dials and no conversation restarted at 0; leads that hit call control went to 4 Closed, and a new call control disposition closes a lead too, with no call control text). New imported leads start at 0. The hub and the text drafting advance a lead from Tracker activity after the baseline date; the sheet column itself is the starting stage.
- You work Outcome, Next Step, Cohort, Best Call Block, Presentation Date and Notes. A lead is on the call list when it has a Next Step.
- The four history columns hold the dial and text counts and dates typed before Kixie logging began. Stop typing them. The hub adds Kixie dials and texts from the Tracker (dated after 2026-10-31) on top, matched by the last 10 digits of the phone.
- This tab replaces **All Leads Master** and **Call Lists**, which can be archived. The hub still falls back to them if Leads is empty.

## Tab: Text Settings

Rules for automatic texting, read by n8n each time it runs. Change a value here and the next run uses it.

| Setting | Default | What it does |
|---|---|---|
| Dry run | Yes | Yes = nothing is sent; approving a batch only marks the drafts "Dry run". Leave on until Kixie sending is connected and tested. |
| Send days | Mon-Fri | Days drafts are created (Regina time). |
| Default window start / end hour | 13 / 19 | Texting window for a lead with no call block rule. |
| Reminder window start / end hour | 9 / 20 | Hours a booking reminder can go out. |
| Reminder hours before | 3 | A reminder is drafted when the appointment starts within this many hours. |
| Max texts per lead per day | 1 | Reminders are not counted. |
| First text: days after added | 14 | New leads get a first text if never texted. |
| Follow-up: days after no-answer call | 7 | Follow-up window after an unanswered call (PowerDialer 'Agent Ended' drops count as dials). |
| First text days | Mon,Wed | Days Stage 0 leads get their first text, so first texts and calls never mix on one day. |
| Stage baseline date | 2026-11-02 | Date the Stage column was set; texts and calls on or after it advance a lead. |
| Max first texts per run / Max drafts per run | 25 / 30 | Keeps each approval batch manageable. Call control first, then first texts, then follow-ups. |
| First text test | A/B | A = booking-first wording, B = right-now invite. A/B splits by the last two digits of the phone; the draft's Ref column records the version. |
| Call control: days | 7 | Window for the call control text after a call-control call. |
| Calendly link: McGruff/ChildSafe, Will Kit, Union | blank | Used in the first text and follow-up. Drafts that need a link are skipped while it is blank. |
| Approval email to, Kixie sender email | your address | Where approval emails go, and the Kixie user texts are sent as. |
| Call block: ON Will Kit | 1-3 PM | Best call block (Regina time) by province. |
| Call block: ON other | 3-5 PM | Ontario leads that are not Will Kit. |
| Call block: AB, SK | 3-5 PM | |
| Call block: BC | 5-7 PM | A province with no row uses the default window. |

Message wording comes from the **Scripts** tab (First text, Follow-up text, Text - call control, Booking reminder text). Edit a script there and the next draft uses it. Trailing notes such as "- DRAFT, approve before sending" are removed from the text sent.

The call block rules fill **Best Call Block** for each lead on the Leads tab and for every new lead the daily import adds. A block written on a lead's own row takes priority over the rule.

## Tab: Text Queue

One row per drafted text. Columns: Draft ID, Batch ID, Created, Kind (First text, Follow-up, Call control, Reminder), Lead Type, Name, Phone, Message, Window, Status, Updated, Result, Ref. Status moves from `Pending` to `Dry run`, `Sent`, `Skipped` (unticked), `Expired` (earlier day, or outside the lead's call block when approved) or `Blocked`. Ref holds the Calendly booking ID for reminders.

## Tab: Power Lists

| Col | Header | Notes |
|---|---|---|
| A | Power List ID | Kixie list ID (currently blank; paste it in) |
| B | Power List Name | `AB/SK Leads`, `BC Leads`, `ON Leads` |
| C | Category | `Leads`, or `Recruiting`. Calls from Recruiting lists are written as `Recruiting Call` |
| D | Notes | |

## Tab: All Leads Master (manual, per-lead)

Lead Inbox, Lead Type, Lead Name, Phone Number, Province, Call Dates, Total Dials, Text Dates, Total Texts, Presentation Date, Outcome. A small Metric / Goal / Actual block (Dials, Texts, ...) sits in columns M to O. This is the per-lead history the Pipeline tab would read.

## Tab: Call Lists (manual working list)

Lead Inbox, Lead Type, Province, Cohort, Lead Name, Phone Number, Best call block, Text Dates, Dial Dates, Next step, Notes.

## Tab: Stats (manual daily inputs from Kixie)

One row per day: Date, Dials, Connections, Texts Sent, Text Replies, Bookings Made, Bookings Shown, Bookings No-Show. The first data row is a "MTD to 10/28/2026" opening balance. Cumulative stats add the daily rows to it.

## Tab: November 20k ALP Plan (text plan)

$20,000 ALP target, $1,000 average policy, 20 sales, 30% close rate, 67 presentations, 21 working days, weekly targets of 16/16/16/19 presentations and 5 sales a week. Note: the dashboard defaults (10% close rate, 47% show rate, 25 Mon-Sat workdays) differ from this plan (30% close rate, 21 weekdays). Decide which is canonical.

## Other tabs

Weekly Schedule, Cadence, Scripts, Sale by Fri Oct 30, Stage Alignment Plan: planning and reference material, not read by automation.

## Counting rules

- Dials = `Call` rows. Conversations = `Call` rows whose Notes start with `Connected`, excluding no answer, voicemail and call control.
- Recruiting calls are never mixed into sales dials.
- On the dashboard, dials and conversations for the current month come from the Tracker (Kixie) on any day that has `Call` rows, and from the `Stats` tab on days that do not. Texts sent and replies work the same way from `Text` and `Text Reply` rows. Bookings, shown and no-shows still come from the `Stats` tab.
- Calendly bookings are `Appointment Set`; recruiting interviews are excluded from sales bookings. A booking is dropped from the count when a `Booking Canceled` row has the same Booking ID (or the same name and appointment time on older rows). A reschedule cancels the old booking and creates a new one, so it still counts once. "Next presentations" on the dashboard lists future appointments without an outcome from the Tracker, and "Needs an outcome" lists started appointments from the last 14 days with no `Presentation Held` or `No-Show`. Shown and no-show counts on the dashboard and Stats tab come from those rows, dated on the appointment day.
- ALP is summed from `Application Submitted` rows.
- Plan maths: ALP goal / average ALP / close rate = presentations needed; / show rate = bookings needed; x dials per conversation = dials needed.

## Known gaps (proposed new tabs)

- **Policies**: Issue date, Client, Carrier, Product, ALP, Commission %, Expected commission, Status (`submitted`, `issued`, `paid`, `chargeback`), Key. Needed for the Policies & Commissions tab.
- **Goals**: Month, ALP goal, average ALP, close rate, show rate, dials per conversation, workdays. Replaces the numbers hard-coded in the dashboard and the free-text plan tab.
- **Import log**: Timestamp, Source, Rows added, Rows skipped, Notes. Written by n8n.
- A dedupe **Key** column on Tracker so re-imports are safe.
- Daily stats are typed in by hand on `Stats`; they could be computed from Tracker instead.
