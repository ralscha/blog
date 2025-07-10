import {inject, Injectable} from '@angular/core';
import {parse, ParseResult} from 'papaparse';
import * as lf from 'lovefield';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Filter} from '../filter';
import {firstValueFrom} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EarthquakeService {
  private readonly http = inject(HttpClient);


  private readonly DATA_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv';
  // private readonly DATA_URL = 'assets/data/all_month.csv';
  private schemaBuilder!: lf.schema.Builder;
  private earthquakeDb!: lf.Database;
  private eqTbl!: lf.schema.Table;

  createSchema() {
    this.schemaBuilder = lf.schema.create('earthquake', 1);

    this.schemaBuilder.createTable('Earthquakes')
      .addColumn('time', lf.Type.DATE_TIME)
      .addColumn('latitude', lf.Type.NUMBER)
      .addColumn('longitude', lf.Type.NUMBER)
      .addColumn('depth', lf.Type.NUMBER)
      .addColumn('mag', lf.Type.NUMBER)
      .addColumn('magType', lf.Type.STRING)
      .addColumn('nst', lf.Type.INTEGER)
      .addColumn('gap', lf.Type.NUMBER)
      .addColumn('dmin', lf.Type.NUMBER)
      .addColumn('rms', lf.Type.NUMBER)
      .addColumn('net', lf.Type.STRING)
      .addColumn('id', lf.Type.STRING)
      .addColumn('updated', lf.Type.DATE_TIME)
      .addColumn('place', lf.Type.STRING)
      .addColumn('type', lf.Type.STRING)
      .addColumn('horizontalError', lf.Type.NUMBER)
      .addColumn('depthError', lf.Type.NUMBER)
      .addColumn('magError', lf.Type.NUMBER)
      .addColumn('magNst', lf.Type.INTEGER)
      .addColumn('status', lf.Type.STRING)
      .addColumn('locationSource', lf.Type.STRING)
      .addColumn('magSource', lf.Type.STRING)
      .addPrimaryKey(['id'])
      .addIndex('idxMag', ['mag'], false, lf.Order.DESC)
      .addIndex('idxDepth', ['depth'], false, lf.Order.DESC)
      .addIndex('idxTime', ['time'], false, lf.Order.DESC);
  }

  async init() {
    this.createSchema();

    this.earthquakeDb = await this.schemaBuilder.connect();
    this.eqTbl = this.earthquakeDb.getSchema().table('Earthquakes');
    const result = await this.earthquakeDb.select(this.eqTbl['id']).from(this.eqTbl).limit(1).exec();

    if (result.length === 0) {
      return firstValueFrom(this.loadAndInsertData());
    }
    return Promise.resolve();
  }

  insertData(parsedData: ParseResult<EarthquakeRow>): Promise<Array<object>> {
    const rows = [];
    for (const parsedRow of parsedData.data) {

      if (!parsedRow.id) {
        continue;
      }

      const row = this.eqTbl.createRow({
        time: new Date(parsedRow.time),
        latitude: Number(parsedRow.latitude),
        longitude: Number(parsedRow.longitude),
        depth: Number(parsedRow.depth),
        mag: Number(parsedRow.mag),
        magType: parsedRow.magType,
        nst: Number(parsedRow.nst),
        gap: Number(parsedRow.gap),
        dmin: Number(parsedRow.dmin),
        rms: Number(parsedRow.rms),
        net: parsedRow.net,
        id: parsedRow.id,
        updated: new Date(parsedRow.updated),
        place: parsedRow.place,
        type: parsedRow.type,
        locationSource: parsedRow.locationSource,
        magSource: parsedRow.magSource,
        horizontalError: Number(parsedRow.horizontalError),
        depthError: Number(parsedRow.depthError),
        magError: Number(parsedRow.magError),
        magNst: Number(parsedRow.magNst),
        status: parsedRow.status
      });
      rows.push(row);
    }

    return this.earthquakeDb.insertOrReplace()
      .into(this.eqTbl)
      .values(rows).exec();

  }

  loadAndInsertData() {
    return this.http.get(this.DATA_URL, {responseType: 'text'})
      .pipe(
        map(data => parse<EarthquakeRow>(data, {header: true})),
        map(parsedData => this.insertData(parsedData))
      );
  }

  select(filter: Filter) {

    const query = this.earthquakeDb.select(this.eqTbl['id'], this.eqTbl['mag'], this.eqTbl['time'],
      this.eqTbl['place'], this.eqTbl['depth'])
      .from(this.eqTbl);

    switch (filter.sort) {
      case 'time':
        query.orderBy(this.eqTbl['time'], lf.Order.DESC);
        break;
      case 'mag':
        query.orderBy(this.eqTbl['mag'], lf.Order.DESC);
        break;
      case 'depth':
        query.orderBy(this.eqTbl['depth'], lf.Order.ASC);
        break;
    }

    const whereClauses = [];
    if (!(filter.mag.lower === -1 && filter.mag.upper === 10)) {
      whereClauses.push(this.eqTbl['mag'].gte(filter.mag.lower));
      whereClauses.push(this.eqTbl['mag'].lte(filter.mag.upper));
    }

    if (!(filter.depth.lower === -10 && filter.depth.upper === 800)) {
      whereClauses.push(this.eqTbl['depth'].gte(filter.depth.lower));
      whereClauses.push(this.eqTbl['depth'].lte(filter.depth.upper));
    }

    if (filter.time !== '-1') {
      const now = new Date();
      now.setHours(now.getHours() - parseInt(filter.time, 10));
      whereClauses.push(this.eqTbl['time'].gte(now));
    }

    if (whereClauses.length > 0) {
      query.where(lf.op.and(...whereClauses));
    }

    return query.exec();
  }

}

type EarthquakeRow = {
  time: string,
  latitude: string,
  longitude: string,
  depth: string,
  mag: string,
  magType: string,
  nst: string,
  gap: string,
  dmin: string,
  rms: string,
  net: string,
  id: string,
  updated: string,
  place: string,
  type: string,
  horizontalError: string,
  depthError: string,
  magError: string,
  magNst: string,
  status: string,
  locationSource: string,
  magSource: string
};
