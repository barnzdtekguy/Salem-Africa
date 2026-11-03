import { z } from 'zod';
import type { ContentKind, ContentStatus } from './types';

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use a valid YYYY-MM-DD date.');
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, 'Use a valid 24-hour time.');
const dateTimeSchema = z.string().datetime({ offset: true });
const optionalUrl = z.union([z.literal(''), z.string().url()]);

const baseSchema = z.object({
  kind: z.enum(['weekly_program', 'event', 'devotional']),
  title: z.string().trim().min(1).max(180),
  slug: z.union([z.literal(''), z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(180)]).optional().default(''),
  status: z.enum(['draft', 'scheduled', 'published', 'archived']),
  publish_at: dateTimeSchema.nullable().optional(),
  starts_at: dateTimeSchema.nullable().optional(),
  ends_at: dateTimeSchema.nullable().optional(),
  publication_date: dateSchema.nullable().optional(),
  image_url: z.string().max(2048).nullable().optional(),
  image_alt: z.string().trim().max(300).optional().default(''),
  expected_version: z.number().int().positive().optional(),
  data: z.record(z.string(), z.unknown()),
});

const weeklyProgramSchema = z.object({
  description: z.string().max(12000).default(''),
  dayOfWeek: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  startTime: timeSchema,
  endTime: timeSchema.optional().or(z.literal('')),
  venue: z.string().trim().min(1).max(300),
  minister: z.string().max(300).default(''),
  recurrence: z.enum(['weekly', 'specific_dates']),
  specificDates: z.array(dateSchema).max(100).default([]),
  livestreamUrl: optionalUrl.default(''),
  exceptions: z.array(z.object({
    date: dateSchema,
    status: z.enum(['changed', 'cancelled']),
    startTime: timeSchema.optional().or(z.literal('')),
    venue: z.string().max(300).optional().default(''),
    note: z.string().max(1000).optional().default(''),
  })).max(100).default([]),
});

const eventSchema = z.object({
  theme: z.string().max(300).default(''),
  description: z.string().max(12000).default(''),
  startDate: dateSchema,
  endDate: dateSchema,
  startTime: timeSchema,
  endTime: timeSchema.optional().or(z.literal('')),
  venue: z.string().trim().min(1).max(300),
  speakers: z.array(z.string().trim().min(1).max(180)).max(30).default([]),
  registrationUrl: optionalUrl.default(''),
  livestreamUrl: optionalUrl.default(''),
});

const devotionalSchema = z.object({
  publicationDate: dateSchema,
  author: z.string().trim().min(1).max(180),
  bibleReference: z.string().trim().min(1).max(180),
  scriptureText: z.string().trim().min(1).max(12000),
  message: z.string().trim().min(1).max(30000),
  prayer: z.string().trim().min(1).max(12000),
  furtherReading: z.string().max(1000).default(''),
});

export type ValidContentInput = {
  kind: ContentKind;
  title: string;
  slug: string;
  status: ContentStatus;
  publish_at: string | null;
  starts_at: string | null;
  ends_at: string | null;
  publication_date: string | null;
  image_url: string | null;
  image_alt: string;
  expected_version?: number;
  data: Record<string, unknown>;
};

function localDateTimeToIso(date: string, time: string) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const utcMillis = Date.UTC(year, month - 1, day, hour, minute) - 60 * 60 * 1000;
  return new Date(utcMillis).toISOString();
}

export function parseContentInput(input: unknown): ValidContentInput {
  const base = baseSchema.parse(input);
  const parsedData = base.kind === 'weekly_program'
    ? weeklyProgramSchema.parse(base.data)
    : base.kind === 'event'
      ? eventSchema.parse(base.data)
      : devotionalSchema.parse(base.data);

  let startsAt = base.starts_at ?? null;
  let endsAt = base.ends_at ?? null;
  let publicationDate = base.publication_date ?? null;
  if (base.kind === 'weekly_program') {
    const data = parsedData as z.infer<typeof weeklyProgramSchema>;
    if (data.recurrence === 'specific_dates' && data.specificDates.length === 0) {
      throw new Error('Add at least one date for a date-specific program.');
    }
    if (data.endTime && data.endTime <= data.startTime) {
      throw new Error('The end time must be later than the start time.');
    }
  }
  if (base.kind === 'event') {
    const data = parsedData as z.infer<typeof eventSchema>;
    if (data.endDate < data.startDate) throw new Error('The event end date must be on or after its start date.');
    if (data.endDate === data.startDate && data.endTime && data.endTime < data.startTime) {
      throw new Error('The event end time must be on or after its start time.');
    }
    startsAt = localDateTimeToIso(data.startDate, data.startTime);
    endsAt = data.endTime ? localDateTimeToIso(data.endDate, data.endTime) : null;
  }
  if (base.kind === 'devotional') {
    const data = parsedData as z.infer<typeof devotionalSchema>;
    publicationDate = data.publicationDate;
  }
  if (base.status === 'scheduled' && !base.publish_at) {
    throw new Error('Choose a publication date and time before scheduling.');
  }
  const publishAt = base.status === 'scheduled' ? base.publish_at ?? null : null;
  if (base.image_url) {
    if (!base.image_url.startsWith('/') || base.image_url.startsWith('//')) {
      throw new Error('Choose an image from the Salem website or the media library.');
    }
    if (!base.image_alt.trim()) throw new Error('Add alternative text for the selected image.');
  }

  return {
    ...base,
    publish_at: publishAt,
    starts_at: startsAt,
    ends_at: endsAt,
    publication_date: publicationDate,
    image_url: base.image_url ?? null,
    slug: base.slug.toLowerCase(),
    data: parsedData,
  };
}
