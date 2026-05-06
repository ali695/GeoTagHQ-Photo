export type LocationSuggestion = {
  id: string;
  displayName: string;
  city?: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
  provider?: string;
  type?: string;
};

export type SelectedLocation = {
  displayName: string;
  lat: number;
  lon: number;
  source: 'search' | 'map' | 'manual' | 'current-location';
  provider?: string;
};
