import {Component} from '@angular/core';
import {EarthquakeService, Earthquake} from "../../providers/earthquake";

@Component({
  selector: 'page-protobuf',
  templateUrl: 'protobuf.html'
})
export class ProtobufPage {
  earthquakes: Earthquake[];

  constructor(private readonly earthquakeService: EarthquakeService) {
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
