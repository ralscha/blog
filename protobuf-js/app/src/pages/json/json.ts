import {Component} from '@angular/core';
import {EarthquakeService, Earthquake} from "../../providers/earthquake";

@Component({
  selector: 'page-json',
  templateUrl: 'json.html'
})
export class JsonPage {
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
    this.earthquakeService.fetchJson().subscribe(data => this.earthquakes = data);
  }

}
