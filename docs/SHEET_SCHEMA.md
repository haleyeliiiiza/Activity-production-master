# Activity Hub sheet layout

Sheet: **Master Lead/Activity Tracker** (private Google Sheet). Sheet ID: _add here; it is not stored in this repo yet._

> Status: columns below marked ✔ are confirmed from the dashboard code. Everything else is a proposed layout to check against the live sheet before building on it.

## Tab: Tracker (the source of truth)

| Header | Notes |
|---|---|
| Date ✔ | YYYY-MM-DD |
| Type ✔ | `Call`, `Recruiting Call`, `New Lead`, `Appointment Set`, `Presentation Held`, `No-Show`, `Application Submitted`, `Policy Issued`, `Follow-Up` |
| Notes ✔ | Kixie disposition. Starts with `Connected` for a real conversation; `no answer`, `voicemail` and `call control` do not count. Contains `interview` for recruiting interviews |
| Premium ✔ | ALP in dollars, on `Application Submitted` rows |
| Power List ✔ | Name of the list the call came from. Must match a row on the Power Lists tab |

Premium, Notes and Power List are read from a second range of the same tab and joined to Date/Type by sheet row number, so rows must never be re-sorted or have rows inserted mid-sheet without refreshing both ranges.

Proposed additions (not yet confirmed): Lead name, Phone, Source, Carrier, Product, Commission, Issue date, Key (dedupe).

## Tab: Power Lists ✔

One row per Kixie power list. Includes a flag marking a list as **Recruiting**; calls from those lists are written with Type `Recruiting Call` and excluded from sales numbers.

## Counting rules

- Dials = `Call` rows. Conversations = `Call` rows whose Notes start with `Connected` (and are not no answer / voicemail / call control).
- Recruiting calls are never mixed into sales dials.
- Calendly bookings are `Appointment Set`; recruiting interviews are excluded from sales bookings.
- ALP is summed from `Application Submitted` rows (dated by submit date).
- Plan maths: ALP goal ÷ average ALP ÷ close rate ÷ show rate = bookings needed; × dials per conversation = dials needed.

## Proposed tabs (new)

- **Policies**: Issue date, Client, Carrier, Product, ALP, Commission %, Expected commission, Status (`submitted`, `issued`, `paid`, `chargeback`), Key.
- **Goals**: Month, ALP goal, average ALP, close rate, show rate, dials per conversation, workdays.
- **Import log**: Timestamp, Source, Rows added, Rows skipped, Notes. Written by n8n.
