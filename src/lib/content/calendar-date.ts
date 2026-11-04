const CALENDAR_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const SQL_DATE_TIME_PATTERN = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})(?:\.(\d{1,6}))?$/;

function isValidParts(year: number, month: number, day: number) {
  if (year < 1 || month < 1 || month > 12 || day < 1) return false;
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

export function normalizeCalendarDate(value: Date | string | null | undefined): string | null {
  if (value instanceof Date) {
    if (!Number.isFinite(value.getTime())) return null;
    const year = value.getUTCFullYear();
    const month = value.getUTCMonth() + 1;
    const day = value.getUTCDate();
    if (!isValidParts(year, month, day)) return null;
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }
  if (typeof value !== 'string') return null;
  const match = CALENDAR_DATE_PATTERN.exec(value);
  if (!match) return null;
  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  if (!isValidParts(year, month, day)) return null;
  return value;
}

export function normalizeDatabaseDateTime(value: Date | string | null | undefined): string | null {
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.toISOString() : null;
  if (typeof value !== 'string' || value.length === 0) return null;

  const sqlMatch = SQL_DATE_TIME_PATTERN.exec(value);
  if (sqlMatch) {
    const date = normalizeCalendarDate(sqlMatch[1]);
    if (!date) return null;
    const [hour, minute, second] = sqlMatch[2].split(':').map(Number);
    if (hour > 23 || minute > 59 || second > 59) return null;
    const millis = (sqlMatch[3] ?? '').padEnd(3, '0').slice(0, 3);
    return `${date}T${sqlMatch[2]}.${millis}Z`;
  }

  const milliseconds = Date.parse(value);
  return Number.isFinite(milliseconds) ? new Date(milliseconds).toISOString() : null;
}

export function formatCalendarDate(value: string | null | undefined, options: Intl.DateTimeFormatOptions) {
  const date = normalizeCalendarDate(value);
  if (!date) return null;
  const [year, month, day] = date.split('-').map(Number);
  const parsed = new Date(0);
  parsed.setUTCHours(12, 0, 0, 0);
  parsed.setUTCFullYear(year, month - 1, day);
  return new Intl.DateTimeFormat('en-NG', {
    ...options,
    timeZone: 'Africa/Lagos',
  }).format(parsed);
}
