export interface Filter {

  mag: {
    lower: number,
    upper: number
  };

  depth: {
    lower: number,
    upper: number
  };

  time: string;

  sort: 'mag' | 'depth' | 'time';

}
