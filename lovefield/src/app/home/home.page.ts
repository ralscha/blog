import {Component, inject, OnInit} from '@angular/core';
import {FilterPopoverComponent} from './filter';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  PopoverController
} from '@ionic/angular/standalone';
import {EarthquakeService} from '../services/earthquake';
import {Filter} from '../filter';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {DetailComponent} from './detail';
import {DecimalPipe} from '@angular/common';
import {addIcons} from "ionicons";
import {filterOutline} from "ionicons/icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, DetailComponent, DecimalPipe, IonHeader, IonToolbar, IonTitle, IonNote, IonButtons, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel]
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
  private readonly earthquakeService = inject(EarthquakeService);
  private popoverCtrl = inject(PopoverController);

  constructor() {
    addIcons({filterOutline});
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

