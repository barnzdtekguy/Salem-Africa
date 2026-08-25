import rawChurches from './churches.json';

export interface Church {
  id: number;
  churchName: string;
  country: string;
  state: string;
  city: string;
  fullAddress: string;
  pastorName: string;
  pastorPhones: string[];
  googleMapsQuery: string;
  imagePlaceholder: string;
  serviceTimes: string;
}

export const CHURCHES: Church[] = rawChurches as Church[];
