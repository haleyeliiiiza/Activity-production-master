# Activity Hub sheet layout

Sheet: **Master Lead/Activity Tracker** (private Google Sheet, 11 tabs). The sheet ID is deliberately not stored in this repo: it is public, and the sheet holds client names and phone numbers. Keep the ID in the n8n credentials and the Claude dashboard.

Checked against the live sheet on 2026-11-02.

## Tab: Tracker (activity source of truth, written by n8n)

Header row, A to J:

| Col | Header | Notes |
|---|---|---|
| A | Date | YYYY-MM-DD |
| B | Type | `Call`, `Recruiting Call`, `New Lead`, `Appointment Set`, `Presentation Held`, `No-Show`, `Application Submitted`, `Policy Issued`, `Follow-Up`, `Text` (sent, from Kixie), `Text Reply` (received, from Kixie) |
| C | Name | Lead name |
| D | Phone | |
| E | Email | |
| F | Premium | ALP in dollars, on `Application Submitted` rows |
| G | Source | `Kixie`, `Form`, `Calendly` |
| H | Notes | Kixie rows: `<disposition> \| <direction> \| <duration> \| <disposed?> \| <recording link>`. A disposition starting `Connected` is a real conversation; `No answer`, voicemail and call control are not. Contains `interview` for recruiting interviews |
| I | Power List ID | Kixie list ID |
| J | Power List | List name, matching `Power Lists` column B |

The November dashboard reads Date/Type and Premium/Notes/Power List as separate ranges and joins them by sheet row number, so do not sort the tab or insert rows mid-sheet.

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
- Calendly bookings are `Appointment Set`; recruiting interviews are excluded from sales bookings.
- ALP is summed from `Application Submitted` rows.
- Plan maths: ALP goal / average ALP / close rate = presentations needed; / show rate = bookings needed; x dials per conversation = dials needed.

## Known gaps (proposed new tabs)

- **Policies**: Issue date, Client, Carrier, Product, ALP, Commission %, Expected commission, Status (`submitted`, `issued`, `paid`, `chargeback`), Key. Needed for the Policies & Commissions tab.
- **Goals**: Month, ALP goal, average ALP, close rate, show rate, dials per conversation, workdays. Replaces the numbers hard-coded in the dashboard and the free-text plan tab.
- **Import log**: Timestamp, Source, Rows added, Rows skipped, Notes. Written by n8n.
- A dedupe **Key** column on Tracker so re-imports are safe.
- Daily stats are typed in by hand on `Stats`; they could be computed from Tracker instead.
