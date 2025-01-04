import {Component, OnInit} from '@angular/core';
import {EarthquakeService} from '../earthquake.service';
import {IEarthquake} from '../protos/earthquake';

@Component({
    selector: 'app-json',
    templateUrl: './json.page.html',
    styleUrls: ['./json.page.scss'],
    standalone: false
})
export class JsonPage implements OnInit {

  earthquakes: IEarthquake[] = [];

  constructor(private readonly earthquakeService: EarthquakeService) {
  }

  doRefresh(event: Event): void {
    this.earthquakeService.refresh().subscribe(() => {
      this.earthquakeService
        .fetchJson()
        .subscribe(data => {
          this.earthquakes = data;
          (event as CustomEvent).detail.complete();
        });
    });
  }

  ngOnInit(): void {
    this.earthquakeService.fetchJson().subscribe(data => this.earthquakes = data);
  }

}
