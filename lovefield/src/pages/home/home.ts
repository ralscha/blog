import {Component, NgZone} from '@angular/core';
import {EarthquakeService} from "../../providers/earthquake-service";
import {PopoverController} from "ionic-angular";
import {FilterPopover} from "./filter";
import {Filter} from "../../filter";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  earthquakes;
  elapsedTime: number;

  filter: Filter = {
    mag: {
      lower: -1,
      upper: 10
    },
    depth: {
      lower: -10,
      upper: 800
    },
    time: -1,
    sort: 'time'
  };

  constructor(private readonly earthquakeService: EarthquakeService,
              private ngZone: NgZone,
              private popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    this.earthquakeService.init().then(() => this.execSelectQuery());
  }

  execSelectQuery() {
    const start = performance.now();
    this.earthquakeService.select(this.filter).then(rows => {
      this.elapsedTime = performance.now() - start;
      this.ngZone.run(() => this.earthquakes = rows);
    });
  }

  identify(index, item) {
    return item.id;
  }

  presentPopover(event) {
    const popover = this.popoverCtrl.create(FilterPopover, {filter: this.filter});

    popover.present({
      ev: event
    });

    popover.onDidDismiss(filter => {
      if (filter) {
        this.filter = filter;
        this.execSelectQuery();
      }
    });
  }

}
