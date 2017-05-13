import {Component} from '@angular/core';
import {PopoverController} from "ionic-angular";
import {FilterPopover} from "./filter";
import {Filter} from "../../filter";
import {EarthquakeProvider} from "../../providers/earthquake/earthquake";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  earthquakes = [];
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

  constructor(private readonly earthquakeService: EarthquakeProvider,
              private popoverCtrl: PopoverController) {
  }

  ionViewDidLoad() {
    this.earthquakeService.init().then(() => this.execSelectQuery());
  }

  execSelectQuery() {
    const start = performance.now();
    this.earthquakeService.select(this.filter).then(rows => {
      this.elapsedTime = performance.now() - start;
      this.earthquakes = rows;
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
