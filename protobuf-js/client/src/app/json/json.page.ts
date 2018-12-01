import {Component, OnInit} from '@angular/core';
import {EarthquakeService} from '../earthquake.service';
import {IEarthquake} from '../protos/earthquake';

@Component({
  selector: 'app-json',
  templateUrl: './json.page.html',
  styleUrls: ['./json.page.scss']
})
export class JsonPage implements OnInit {

  earthquakes: IEarthquake[];

  constructor(private readonly earthquakeService: EarthquakeService) {
  }

  doRefresh(event) {
    this.earthquakeService.refresh().subscribe(() => {
      this.earthquakeService
        .fetchJson()
        .subscribe(data => {
          this.earthquakes = data;
          event.target.complete();
        });
    });
  }

  ngOnInit() {
    this.earthquakeService.fetchJson().subscribe(data => this.earthquakes = data);
  }

}
