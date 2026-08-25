import rawMinistries from './ministries.json';

export interface Ministry {
  name: string;
  description: string;
  image: string;
  joinLink: string;
  subMinistries: string[];
}

export const MINISTRIES: Ministry[] = rawMinistries as Ministry[];
