import rawEvents from './events.json';

export interface SalemEvent {
  slug: string;
  title: string;
  category: string;
  startDateTime: string;
  endDateTime?: string;
  location: string;
  image: string;
  description: string;
  featured?: boolean;
}

export const EVENTS: SalemEvent[] = [...(rawEvents as SalemEvent[])].sort(
  (a, b) => new Date(a.startDateTime).getTime() - new Date(b.startDateTime).getTime()
);
