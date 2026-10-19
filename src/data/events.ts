import rawEvents from './events.json';

export interface SalemEvent {
  slug: string;
  title: string;
  category: string;
  frequency: string;
  schedule: string;
  image: string;
  description: string;
}

export const EVENTS = rawEvents as SalemEvent[];
