import {Component, OnInit} from '@angular/core';
import {IEarthquake} from '../protos/earthquake';
import {EarthquakeService} from '../earthquake.service';

@Component({
  selector: 'app-protobuf',
  templateUrl: './protobuf.page.html',
  styleUrls: ['./protobuf.page.scss']
})
export class ProtobufPage implements OnInit {

  earthquakes: IEarthquake[] = [];

  constructor(private readonly earthquakeService: EarthquakeService) {
  }

  doRefresh(event: Event): void {
    this.earthquakeService.refresh().subscribe(() => {
      this.earthquakeService
        .fetchProtobuf()
        .subscribe(data => {
          this.earthquakes = data;
          (event as CustomEvent).detail.complete();
        });
    });
  }

  ngOnInit(): void {
    this.earthquakeService.fetchProtobuf().subscribe(data => this.earthquakes = data);
  }

}
