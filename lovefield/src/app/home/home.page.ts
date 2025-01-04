import {Component, OnInit} from '@angular/core';
import {FilterPopoverComponent} from './filter';
import {PopoverController} from '@ionic/angular';
import {EarthquakeService} from '../services/earthquake';
import {Filter} from '../filter';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage implements OnInit {
  earthquakes: any = [];
  elapsedTime!: number;

  filter: Filter = {
    mag: {
      lower: -1,
      upper: 10
    },
    depth: {
      lower: -10,
      upper: 800
    },
    time: '-1',
    sort: 'time'
  };

  constructor(private readonly earthquakeService: EarthquakeService,
              private popoverCtrl: PopoverController) {
  }

  ngOnInit() {
    this.earthquakeService.init().then(() => this.execSelectQuery());
  }

  execSelectQuery() {
    const start = performance.now();
    this.earthquakeService.select(this.filter).then(rows => {
      this.elapsedTime = performance.now() - start;
      this.earthquakes = rows;
    });
  }


  async presentPopover(event: any) {
    const popover = await this.popoverCtrl.create({
      component: FilterPopoverComponent,
      event,
      componentProps: {filter: this.filter}
    });
    await popover.present();

    popover.onDidDismiss().then(evt => {
      if (evt.data) {
        this.filter = evt.data;
        this.execSelectQuery();
      }
    });
  }

}

