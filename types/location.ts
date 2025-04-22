// Location data types

export interface LocationData {
  id: string;
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}