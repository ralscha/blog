import * as $protobuf from "protobufjs";
export interface IEarthquake {
    id?: (string|null);
    time?: (string|null);
    latitude?: (number|null);
    longitude?: (number|null);
    depth?: (number|null);
    mag?: (number|null);
    place?: (string|null);
    magType?: (string|null);
}

export class Earthquake implements IEarthquake {
    constructor(properties?: IEarthquake);
    public id: string;
    public time: string;
    public latitude: number;
    public longitude: number;
    public depth: number;
    public mag: number;
    public place: string;
    public magType: string;
    public static create(properties?: IEarthquake): Earthquake;
    public static encode(message: IEarthquake, writer?: $protobuf.Writer): $protobuf.Writer;
    public static encodeDelimited(message: IEarthquake, writer?: $protobuf.Writer): $protobuf.Writer;
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Earthquake;
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Earthquake;
    public static verify(message: { [k: string]: any }): (string|null);
    public static fromObject(object: { [k: string]: any }): Earthquake;
    public static toObject(message: Earthquake, options?: $protobuf.IConversionOptions): { [k: string]: any };
    public toJSON(): { [k: string]: any };
}

export interface IEarthquakes {
    earthquakes?: (IEarthquake[]|null);
}

export class Earthquakes implements IEarthquakes {
    constructor(properties?: IEarthquakes);
    public earthquakes: IEarthquake[];
    public static create(properties?: IEarthquakes): Earthquakes;
    public static encode(message: IEarthquakes, writer?: $protobuf.Writer): $protobuf.Writer;
    public static encodeDelimited(message: IEarthquakes, writer?: $protobuf.Writer): $protobuf.Writer;
    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): Earthquakes;
    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): Earthquakes;
    public static verify(message: { [k: string]: any }): (string|null);
    public static fromObject(object: { [k: string]: any }): Earthquakes;
    public static toObject(message: Earthquakes, options?: $protobuf.IConversionOptions): { [k: string]: any };
    public toJSON(): { [k: string]: any };
}
