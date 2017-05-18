import {Component} from '@angular/core';
import {Earthquake, EarthquakeProvider} from "../../providers/earthquake/earthquake";

@Component({
  selector: 'page-protobuf',
  templateUrl: 'protobuf.html'
})
export class ProtobufPage {
  earthquakes: Earthquake[];

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
