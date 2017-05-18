import {Component} from '@angular/core';
import {Earthquake, EarthquakeProvider} from "../../providers/earthquake/earthquake";

@Component({
  selector: 'page-json',
  templateUrl: 'json.html'
})
export class JsonPage {
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
    this.earthquakeService.fetchJson().subscribe(data => this.earthquakes = data);
  }

}
