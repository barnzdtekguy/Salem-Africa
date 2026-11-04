import 'server-only';
import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { randomUUID } from 'node:crypto';
import { EVENTS as LEGACY_EVENTS, type SalemEvent } from '@/data/events';
import { getDatabase } from '@/lib/db';
import type { ContentItem, ContentKind, ContentStatus } from './types';

type ContentRow = RowDataPacket & Omit<ContentItem, 'data' | 'publish_at' | 'starts_at' | 'ends_at' | 'created_at' | 'updated_at'> & {
  data: string | Record<string, unknown>;
  publish_at: Date | string | null;
  starts_at: Date | string | null;
  ends_at: Date | string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

function toIso(value: Date | string | null) {
  if (value === null) return null;
  if (value instanceof Date) return value.toISOString();
  return `${value.replace(' ', 'T')}Z`;
}

function mapContentRow(row: ContentRow): ContentItem {
  return {
    ...row,
    publish_at: toIso(row.publish_at),
    starts_at: toIso(row.starts_at),
    ends_at: toIso(row.ends_at),
    created_at: toIso(row.created_at) ?? '',
    updated_at: toIso(row.updated_at) ?? '',
    data: typeof row.data === 'string' ? JSON.parse(row.data) as Record<string, unknown> : row.data,
  };
}

function toDatabaseDate(value: string | null) {
  return value ? new Date(value).toISOString().slice(0, 23).replace('T', ' ') : null;
}

const CONTENT_COLUMNS = `
  id, kind, slug, title,
  CASE WHEN status = 'scheduled' AND publish_at <= UTC_TIMESTAMP(3)
    THEN 'published' ELSE status END AS status,
  publish_at, starts_at, ends_at,
  publication_date, image_url, image_alt, data, version, created_by,
  created_by_email, updated_by, updated_by_email, created_at, updated_at
`;

export async function listContent(options: {
  kind?: ContentKind;
  status?: ContentStatus;
  query?: string;
} = {}) {
  const conditions: string[] = [];
  const values: string[] = [];
  if (options.kind) {
    conditions.push('kind = ?');
    values.push(options.kind);
  }
  if (options.status) {
    if (options.status === 'published') {
      conditions.push("(status = 'published' OR (status = 'scheduled' AND publish_at <= UTC_TIMESTAMP(3)))");
    } else if (options.status === 'scheduled') {
      conditions.push("status = 'scheduled' AND publish_at > UTC_TIMESTAMP(3)");
    } else {
      conditions.push('status = ?');
      values.push(options.status);
    }
  }
  if (options.query) {
    conditions.push('title LIKE ?');
    values.push(`%${options.query.replace(/[\\%_]/g, '\\$&')}%`);
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const [rows] = await getDatabase().execute<ContentRow[]>(
    `SELECT ${CONTENT_COLUMNS} FROM content_items ${where} ORDER BY updated_at DESC`,
    values,
  );
  return rows.map(mapContentRow);
}

export async function createContent(input: {
  kind: ContentKind;
  slug: string;
  title: string;
  status: ContentStatus;
  publish_at: string | null;
  starts_at: string | null;
  ends_at: string | null;
  publication_date: string | null;
  image_url: string | null;
  image_alt: string;
  data: Record<string, unknown>;
}, staff: { userId: string; email: string }) {
  const id = randomUUID();
  await getDatabase().execute<ResultSetHeader>(
    `INSERT INTO content_items
      (id, kind, slug, title, status, publish_at, starts_at, ends_at,
       publication_date, image_url, image_alt, data, created_by, created_by_email,
        updated_by, updated_by_email, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP(3), UTC_TIMESTAMP(3))`,
    [
      id, input.kind, input.slug, input.title, input.status, toDatabaseDate(input.publish_at),
      toDatabaseDate(input.starts_at), toDatabaseDate(input.ends_at), input.publication_date,
      input.image_url, input.image_alt, JSON.stringify(input.data), staff.userId, staff.email,
      staff.userId, staff.email,
    ],
  );
  const item = await getContentById(id);
  if (!item) throw new Error('The saved content item could not be reloaded.');
  return item;
}

export async function getContentById(id: string) {
  const [rows] = await getDatabase().execute<ContentRow[]>(
    `SELECT ${CONTENT_COLUMNS} FROM content_items WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows[0] ? mapContentRow(rows[0]) : null;
}

export async function updateContent(id: string, version: number, input: {
  kind: ContentKind;
  slug: string;
  title: string;
  status: ContentStatus;
  publish_at: string | null;
  starts_at: string | null;
  ends_at: string | null;
  publication_date: string | null;
  image_url: string | null;
  image_alt: string;
  data: Record<string, unknown>;
}, staff: { userId: string; email: string }) {
  const [result] = await getDatabase().execute<ResultSetHeader>(
    `UPDATE content_items
     SET kind = ?, slug = ?, title = ?, status = ?, publish_at = ?, starts_at = ?,
         ends_at = ?, publication_date = ?, image_url = ?, image_alt = ?, data = ?,
         updated_by = ?, updated_by_email = ?, version = version + 1,
         updated_at = UTC_TIMESTAMP(3)
     WHERE id = ? AND version = ?`,
    [
      input.kind, input.slug, input.title, input.status, toDatabaseDate(input.publish_at),
      toDatabaseDate(input.starts_at), toDatabaseDate(input.ends_at), input.publication_date,
      input.image_url, input.image_alt, JSON.stringify(input.data), staff.userId, staff.email,
      id, version,
    ],
  );
  if (!result.affectedRows) return null;
  return getContentById(id);
}

export async function deleteContent(id: string, version: number) {
  const [result] = await getDatabase().execute<ResultSetHeader>(
    'DELETE FROM content_items WHERE id = ? AND version = ?',
    [id, version],
  );
  return result.affectedRows > 0;
}

export async function getPublicContent(kind: ContentKind): Promise<ContentItem[]> {
  const [rows] = await getDatabase().execute<ContentRow[]>(
    `SELECT ${CONTENT_COLUMNS}
     FROM content_items
     WHERE kind = ?
       AND (status = 'published'
         OR (status = 'scheduled' AND publish_at IS NOT NULL AND publish_at <= UTC_TIMESTAMP(3)))
     ORDER BY starts_at IS NULL, starts_at ASC, publication_date DESC, created_at DESC`,
    [kind],
  );
  return rows.map(mapContentRow);
}

export async function getPublicContentBySlug(kind: ContentKind, slug: string): Promise<ContentItem | null> {
  const [rows] = await getDatabase().execute<ContentRow[]>(
    `SELECT ${CONTENT_COLUMNS}
     FROM content_items
     WHERE kind = ? AND slug = ?
       AND (status = 'published'
         OR (status = 'scheduled' AND publish_at IS NOT NULL AND publish_at <= UTC_TIMESTAMP(3)))
     LIMIT 1`,
    [kind, slug],
  );
  return rows[0] ? mapContentRow(rows[0]) : null;
}

function toLegacyEvent(item: ContentItem): SalemEvent {
  const data = item.data;
  const start = item.starts_at ? new Date(item.starts_at) : null;
  const day = typeof data.dayOfWeek === 'string' ? data.dayOfWeek : '';
  const startTime = typeof data.startTime === 'string' ? data.startTime : '';
  const endTime = typeof data.endTime === 'string' ? data.endTime : '';
  const specificDates = Array.isArray(data.specificDates)
    ? data.specificDates.filter((date): date is string => typeof date === 'string')
    : [];
  const recurrence = data.recurrence === 'specific_dates'
    ? `Selected dates${specificDates.length ? `: ${specificDates.join(', ')}` : ''}`
    : day ? `Every ${day}` : '';

  return {
    slug: item.slug,
    title: item.title,
    category: item.kind === 'weekly_program' ? 'Weekly Program' : 'Event',
    frequency: recurrence || (start ? start.toLocaleDateString('en-NG', { dateStyle: 'long' }) : ''),
    schedule: startTime
      ? `${startTime}${endTime ? ` to ${endTime}` : ''}`
      : (start ? start.toLocaleTimeString('en-NG', { hour: 'numeric', minute: '2-digit' }) : ''),
    location: typeof data.venue === 'string' ? data.venue : undefined,
    image: item.image_url ?? '',
    imageAlt: item.image_alt,
    description: typeof data.description === 'string' ? data.description : '',
    contentType: item.kind === 'weekly_program' ? 'weekly_program' : 'event',
    startsAt: item.starts_at ?? undefined,
    endsAt: item.ends_at,
    endDate: typeof data.endDate === 'string' ? data.endDate : undefined,
    registrationUrl: typeof data.registrationUrl === 'string' ? data.registrationUrl : undefined,
    livestreamUrl: typeof data.livestreamUrl === 'string' ? data.livestreamUrl : undefined,
    theme: typeof data.theme === 'string' ? data.theme : undefined,
    speakers: Array.isArray(data.speakers)
      ? data.speakers.filter((speaker): speaker is string => typeof speaker === 'string')
      : undefined,
    minister: typeof data.minister === 'string' ? data.minister : undefined,
    exceptions: Array.isArray(data.exceptions) ? data.exceptions as SalemEvent['exceptions'] : undefined,
  };
}

export async function getPublicProgramsAndEvents(): Promise<SalemEvent[]> {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) return LEGACY_EVENTS;
  const [programs, events] = await Promise.all([
    getPublicContent('weekly_program'),
    getPublicContent('event'),
  ]);
  return [...programs.map(toLegacyEvent), ...events.map(toLegacyEvent)];
}

export async function getPublicDevotionals(): Promise<ContentItem[]> {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) return [];
  return getPublicContent('devotional');
}

export async function getPublicDevotional(slug: string): Promise<ContentItem | null> {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) return null;
  return getPublicContentBySlug('devotional', slug);
}

export async function getPublicWeeklyProgram(slug: string): Promise<SalemEvent | null> {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    return LEGACY_EVENTS.find((item) => item.slug === slug && item.contentType !== 'event' && !item.category.startsWith('Conference')) ?? null;
  }
  const item = await getPublicContentBySlug('weekly_program', slug);
  return item ? toLegacyEvent(item) : null;
}

export async function getPublicEvent(slug: string): Promise<SalemEvent | null> {
  if (!process.env.DATABASE_URL && !process.env.DB_HOST) {
    return LEGACY_EVENTS.find((item) => item.slug === slug && (item.contentType === 'event' || item.category.startsWith('Conference'))) ?? null;
  }
  const item = await getPublicContentBySlug('event', slug);
  return item ? toLegacyEvent(item) : null;
}

export function isPublicationToday(item: ContentItem, now = new Date()) {
  if (!item.publication_date) return false;
  const localDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Lagos',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);
  return item.publication_date === localDate;
}
