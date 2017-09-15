export interface Filter {

  mag: {
    lower: number,
    upper: number
  };

  distance: {
    lower: number,
    upper: number
  };

  time: number;

  sort: 'mag' | 'time' | 'distance';

  myLocation: {
    latitude: number;
    longitude: number
  };

}
