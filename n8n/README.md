# n8n workflows

All run on the n8n cloud account. Workflow IDs and SDK source files are added here once exported.

## Lead & Activity Tracker

Receives Kixie **End Call** and **PowerDial Attempts** webhooks and adds a `Tracker` row per call. Type is `Call` for lead lists and `Recruiting Call` for lists marked Recruiting on the `Power Lists` tab.

## Log form

n8n form that writes New Lead, Appointment Set, Presentation Held, No-Show, Application Submitted (with ALP), Policy Issued and Follow-Up rows.

## Calendly bookings

Calendly bookings become Appointment Set rows. Recruiting interviews are tagged so the dashboard leaves them out of sales bookings.

## Daily progress report

Every morning at 8 AM (America/Regina) n8n emails a progress report against the monthly goal.

## To do

- Export each workflow's SDK code into this folder (`*.workflow.ts`) and note its ID, as the Finance Hub does.
- Add a dedupe Key and an Import log line to each flow.
