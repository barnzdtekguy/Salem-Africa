import rawEvents from './events.json';

export interface SalemEvent {
  slug: string;
  title: string;
  category: string;
  frequency: string;
  schedule: string;
  location?: string;
  image: string;
  imageAlt?: string;
  description: string;
  contentType?: 'weekly_program' | 'event';
  startsAt?: string;
  endsAt?: string | null;
  endDate?: string;
  registrationUrl?: string;
  livestreamUrl?: string;
  theme?: string;
  speakers?: string[];
  minister?: string;
  exceptions?: { date: string; status: 'changed' | 'cancelled'; startTime?: string; venue?: string; note?: string }[];
}

export const EVENTS = rawEvents as SalemEvent[];
