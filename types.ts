
export interface Location {
  id: number;
  name: string;
  road_address: string;
  lat: number;
  lng: number;
  phone: string;
}

export interface LocationWithDistance extends Location {
  distance: number;
}

export enum AppMode {
  Nearby = 'nearby',
  Address = 'address'
}

export interface Coordinates {
    lat: number;
    lng: number;
}
