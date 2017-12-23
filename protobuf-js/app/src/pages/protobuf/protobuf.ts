import {Component} from '@angular/core';
import {EarthquakeProvider} from "../../providers/earthquake/earthquake";
import {IEarthquake} from "../../protos/earthquake";

@Component({
  selector: 'page-protobuf',
  templateUrl: 'protobuf.html'
})
export class ProtobufPage {
  earthquakes: IEarthquake[];

  constructor(private readonly earthquakeService: EarthquakeProvider) {
  }

  doRefresh(refresher) {
    this.earthquakeService.refresh().subscribe(() => {
      refresher.complete();
      this.ionViewDidLoad();
    });
  }

  ionViewDidLoad() {
    this.earthquakeService.fetchProtobuf().subscribe(data => this.earthquakes = data);
  }

}
