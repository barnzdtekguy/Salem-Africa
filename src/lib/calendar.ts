import type { SalemEvent } from '@/data/events';

/** Format a JS Date as the UTC-basic form iCalendar requires: 20260815T090000Z */
function toIcsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function foldLine(line: string): string {
  // iCalendar lines should be folded at 75 octets; simple approximation.
  if (line.length <= 74) return line;
  const chunks: string[] = [];
  let rest = line;
  while (rest.length > 74) {
    chunks.push(rest.slice(0, 74));
    rest = ' ' + rest.slice(74);
  }
  chunks.push(rest);
  return chunks.join('\r\n');
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function buildIcsFile(event: SalemEvent): string {
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime ?? event.startDateTime);
  const uid = `salem-${event.slug}@salemafrica.org`;
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Salem International Christian Centre//Events//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return lines.map(foldLine).join('\r\n');
}

export function downloadIcsFile(event: SalemEvent) {
  const ics = buildIcsFile(event);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.slug}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function googleDateRange(event: SalemEvent): string {
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime ?? event.startDateTime);
  return `${toIcsDate(start)}/${toIcsDate(end)}`;
}

export function googleCalendarUrl(event: SalemEvent): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: googleDateRange(event),
    details: event.description,
    location: event.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(event: SalemEvent): string {
  const start = new Date(event.startDateTime);
  const end = new Date(event.endDateTime ?? event.startDateTime);
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: event.description,
    location: event.location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function formatEventDateLabel(event: SalemEvent): string {
  const start = new Date(event.startDateTime);
  return start.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

export function formatEventTimeLabel(event: SalemEvent): string {
  const start = new Date(event.startDateTime);
  const startLabel = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (!event.endDateTime) return startLabel;
  const end = new Date(event.endDateTime);
  const sameDay = start.toDateString() === end.toDateString();
  const endLabel = end.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (sameDay) return `${startLabel} – ${endLabel}`;
  return `${startLabel}, ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${endLabel}, ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
}
