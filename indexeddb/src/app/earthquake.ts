export interface Earthquake {

  time: number;
  place: string;
  mag: number;
  depth: number;
  distance?: number;
  latLng: [number, number];

}
