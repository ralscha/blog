import {Component, OnInit} from '@angular/core';
import {IEarthquake} from '../protos/earthquake';
import {EarthquakeService} from '../earthquake.service';

@Component({
  selector: 'app-protobuf',
  templateUrl: './protobuf.page.html',
  styleUrls: ['./protobuf.page.scss']
})
export class ProtobufPage implements OnInit {

  earthquakes: IEarthquake[];

  constructor(private readonly earthquakeService: EarthquakeService) {
  }

  doRefresh(event) {
    this.earthquakeService.refresh().subscribe(() => {
      this.earthquakeService
        .fetchProtobuf()
        .subscribe(data => {
          this.earthquakes = data;
          event.target.complete();
        });
    });
  }

  ngOnInit() {
    this.earthquakeService.fetchProtobuf().subscribe(data => this.earthquakes = data);
  }

}
