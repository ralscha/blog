import Dexie from "dexie";

export class EarthquakeDb extends Dexie {
  earthquakes: Dexie.Table<Earthquake, string>;

  constructor() {
    super("Earthquake");
    this.version(1).stores({
      earthquakes: 'id,mag,time'
    });
  }
}

export interface Earthquake {
  id: string;
  time: number;
  place: string;
  mag: number;
  depth: number;
  distance?: number;
  latLng: [number, number];
}

