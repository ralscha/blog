import {Component} from '@angular/core';
import {EarthquakeProvider} from "../../providers/earthquake/earthquake";
import {IEarthquake} from "../../protos/earthquake";

@Component({
  selector: 'page-json',
  templateUrl: 'json.html'
})
export class JsonPage {
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
    this.earthquakeService.fetchJson().subscribe(data => this.earthquakes = data);
  }

}
