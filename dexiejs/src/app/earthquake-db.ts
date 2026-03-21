import Dexie, {type EntityTable} from 'dexie';

export class EarthquakeDb extends Dexie {
  earthquakes!: EntityTable<Earthquake, 'id'>;

  constructor() {
    super('Earthquake');
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

