export type LocationSuggestion = {
  id: string;
  displayName: string;
  street?: string;
  houseNumber?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  postcode?: string;
  lat: number;
  lon: number;
  provider?: string;
  type?: string;
};

export type SelectedLocation = {
  displayName: string;
  street?: string;
  houseNumber?: string;
  district?: string;
  city?: string;
  state?: string;
  country?: string;
  countryCode?: string;
  postcode?: string;
  lat: number;
  lon: number;
  source: 'search' | 'map' | 'manual' | 'current-location';
  provider?: string;
  type?: string;
  exactMatch?: boolean;
};
