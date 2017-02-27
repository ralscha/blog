export interface Filter {

  mag: {
    lower: number,
    upper: number
  };

  depth: {
    lower: number,
    upper: number
  };

  time: number;

  sort: 'mag' | 'depth' | 'time';

}
