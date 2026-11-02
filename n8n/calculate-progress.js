// "Calculate Progress" code node of the Lead & Activity Tracker workflow (the 8 AM report).
// Uses the same plan and counting rules as the Activity Hub dashboard (see ../README.md).
// Input: every row of the Tracker tab. Output: { subject, html } for the Gmail node.

const GOAL = 20000;
const AVG_ALP = 1000;          // average policy, from the "November 20k ALP Plan" tab
const CLOSE_RATE = 0.30;
const PRES_GOAL = 67;
const SALES_GOAL = 20;
const DASHBOARD_URL = 'https://claude.ai/artifact/BgvjeRSt1Mk6cnSUkMyHvo';
const TZ = 'America/Regina';
// Weekly targets (same as the plan tab). Only used while the month is November 2026.
const PLAN_MONTH = '2026-11';
const WEEKS = [
  { label: 'Nov 2-6',   start: '2026-11-02', end: '2026-11-06', pres: 16, sales: 5 },
  { label: 'Nov 9-13',  start: '2026-11-09', end: '2026-11-13', pres: 16, sales: 5 },
  { label: 'Nov 16-20', start: '2026-11-16', end: '2026-11-20', pres: 16, sales: 5 },
  { label: 'Nov 23-30', start: '2026-11-23', end: '2026-11-30', pres: 19, sales: 5 },
];

const rows = $input.all().map(i => i.json).filter(r => Object.keys(r).length > 0);
const today = $now.setZone(TZ).toFormat('yyyy-MM-dd');
const month = today.slice(0, 7);
const [yy, mm] = month.split('-').map(Number);
const iso = d => month + '-' + String(d).padStart(2, '0');
const money = n => '$' + Math.round(n).toLocaleString('en-CA');
const alpOf = r => parseFloat(String(r.Premium ?? '').replace(/[^0-9.]/g, '')) || 0;

// Weekdays (Mon-Fri) of the month
const lastDay = new Date(Date.UTC(yy, mm, 0)).getUTCDate();
const workdays = [];
for (let d = 1; d <= lastDay; d++) {
  const dow = new Date(Date.UTC(yy, mm - 1, d)).getUTCDay();
  if (dow >= 1 && dow <= 5) workdays.push(iso(d));
}
const planOn = month === PLAN_MONTH;
const weekOf = d => WEEKS.find(w => d >= w.start && d <= w.end);
const planDay = d => {
  if (!planOn) return GOAL / workdays.length;
  const w = weekOf(d);
  if (!w) return 0;
  return AVG_ALP * w.sales / workdays.filter(x => x >= w.start && x <= w.end).length;
};

// Same counting rules as the dashboard
const inMonth = rows.filter(r => String(r.Date || '').startsWith(month));
const of = t => inMonth.filter(r => String(r.Type || '').trim() === t);
const calls = of('Call');
const connected = calls.filter(r => /^connected/i.test(String(r.Notes || '')) && !/no answer|voicemail|call control/i.test(String(r.Notes || '')));
const bookings = of('Appointment Set').filter(r => !/interview/i.test(String(r.Notes || '')));
const apps = of('Application Submitted');
const presRows = of('Presentation Held');
const alp = apps.reduce((s, r) => s + alpOf(r), 0);

const remainingDays = Math.max(workdays.filter(d => d >= today).length, 1);
const gap = Math.max(GOAL - alp, 0);
const perDay = Math.ceil(gap / remainingDays);
const pct = Math.round(alp / GOAL * 100);
const plannedToDate = workdays.filter(d => d < today).reduce((s, d) => s + planDay(d), 0);
const diff = alp - plannedToDate;
const pace = plannedToDate === 0 ? 'Plan starts today'
  : Math.abs(diff) < 1 ? 'On plan'
  : diff > 0 ? money(diff) + ' ahead of plan' : money(-diff) + ' behind plan';

// This week against the weekly target
let weekHtml = '';
if (planOn) {
  const w = weekOf(today) || (today < WEEKS[0].start ? WEEKS[0] : WEEKS[WEEKS.length - 1]);
  const inW = r => String(r.Date) >= w.start && String(r.Date) <= w.end;
  const wApps = apps.filter(inW);
  const cell = 'padding:4px 14px 4px 0';
  weekHtml = '<h3>This week (' + w.label + ')</h3>'
    + '<table style="border-collapse:collapse">'
    + '<tr><th align="left" style="' + cell + '"></th><th align="right" style="' + cell + '">Plan</th><th align="right">So far</th></tr>'
    + '<tr><td style="' + cell + '">Presentations</td><td align="right" style="' + cell + '">' + w.pres + '</td><td align="right">' + presRows.filter(inW).length + '</td></tr>'
    + '<tr><td style="' + cell + '">Sales</td><td align="right" style="' + cell + '">' + w.sales + '</td><td align="right">' + wApps.length + '</td></tr>'
    + '<tr><td style="' + cell + '">ALP</td><td align="right" style="' + cell + '">' + money(AVG_ALP * w.sales) + '</td><td align="right">' + money(wApps.reduce((s, r) => s + alpOf(r), 0)) + '</td></tr>'
    + '</table>';
}

const html = '<h2>Production Progress - ' + month + '</h2>'
  + '<p><b>ALP submitted:</b> ' + money(alp) + ' of ' + money(GOAL) + ' (' + pct + '%) &middot; ' + pace + '</p>'
  + '<p><b>Still needed:</b> ' + money(gap) + ' over ' + remainingDays + ' working days (about ' + money(perDay) + ' a day)</p>'
  + weekHtml
  + '<h3>' + month + ' so far</h3><ul>'
  + '<li>Presentations held: ' + presRows.length + (planOn ? ' of ' + PRES_GOAL : '') + ' &middot; no-shows: ' + of('No-Show').length + '</li>'
  + '<li>Sales (applications submitted): ' + apps.length + (planOn ? ' of ' + SALES_GOAL : '') + (presRows.length ? ' &middot; close rate ' + Math.round(apps.length / presRows.length * 100) + '% (plan ' + Math.round(CLOSE_RATE * 100) + '%)' : '') + '</li>'
  + '<li>Policies issued: ' + of('Policy Issued').length + '</li>'
  + '<li>Dials: ' + calls.length + ' &middot; conversations: ' + connected.length + '</li>'
  + '<li>Appointments set: ' + bookings.length + ' (recruiting interviews left out)</li>'
  + '<li>New leads: ' + of('New Lead').length + ' &middot; follow-ups: ' + of('Follow-Up').length + '</li>'
  + '</ul>'
  + '<p><a href="' + DASHBOARD_URL + '">Open the Activity Hub</a></p>';

return [{ json: { html, subject: 'Daily Production Report: ' + money(alp) + ' / ' + money(GOAL) + ' (' + pace + ')' } }];
