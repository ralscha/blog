import { Component, OnInit, inject } from '@angular/core';
import {FilterPage} from '../filter/filter.page';
import {Earthquake} from '../earthquake-db';
import {EarthquakeService} from '../earthquake.service';
import {Filter} from '../filter-interface';
import {CdkFixedSizeVirtualScroll, CdkVirtualForOf, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {DetailComponent} from '../detail/detail.component';
import {DecimalPipe} from '@angular/common';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  LoadingController,
  ModalController
} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {optionsOutline} from "ionicons/icons";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  imports: [CdkVirtualScrollViewport, CdkFixedSizeVirtualScroll, CdkVirtualForOf, DetailComponent, DecimalPipe, IonHeader, IonToolbar, IonTitle, IonNote, IonButtons, IonButton, IonIcon, IonContent, IonRefresher, IonRefresherContent, IonGrid, IonItem]
})
export class HomePage implements OnInit {
  private readonly earthquakeService = inject(EarthquakeService);
  private readonly modalCtrl = inject(ModalController);
  private readonly loadingCtrl = inject(LoadingController);


  earthquakes: Earthquake[] = [];
  elapsedTime!: number;

  geoWatchId!: number;

  filter: Filter = {
    mag: {
      lower: -1,
      upper: 10
    },
    distance: {
      lower: 0,
      upper: 20000
    },
    time: '-1',
    sort: 'time',
    myLocation: {
      latitude: 0,
      longitude: 0
    }
  };

  constructor() {
    addIcons({optionsOutline});
  }

  ngOnInit(): void {
    const storedFilter = localStorage.getItem('filter');
    if (storedFilter) {
      this.filter = JSON.parse(storedFilter);
    }
    navigator.geolocation.getCurrentPosition(position => {
      this.filter.myLocation = position.coords;

      this.earthquakeService.initProvider()
        .then(() => this.filterEarthquakes())
        .catch(err => console.log(err));

    }, () => {
      this.filter.myLocation = {longitude: 7.5663964, latitude: 46.9268287};
      this.earthquakeService.initProvider()
        .then(() => this.filterEarthquakes())
        .catch(err => console.log(err));
    });

    if (this.geoWatchId) {
      navigator.geolocation.clearWatch(this.geoWatchId);
    }

    this.geoWatchId = navigator.geolocation.watchPosition(position => {
      this.filter.myLocation = position.coords;
    });
  }

  doRefresh(event: Event): void {
    this.earthquakeService.initProvider()
      .then(() => this.filterEarthquakes(true))
      .then(() => (event as CustomEvent).detail.complete());
  }

  async filterEarthquakes(hideLoading = false): Promise<void> {
    localStorage.setItem('filter', JSON.stringify(this.filter));

    let loading = null;

    if (!hideLoading) {
      loading = await this.loadingCtrl.create({
        message: 'Please wait...'
      });
      await loading.present();
    }

    const start = performance.now();
    this.earthquakes = await this.earthquakeService.filter(this.filter);
    this.elapsedTime = performance.now() - start;

    if (loading) {
      loading.dismiss();
    }
  }

  async presentFilterPage(): Promise<void> {
    const filterPage = await this.modalCtrl.create(
      {
        component: FilterPage,
        componentProps: {filter: this.filter}
      }
    );

    await filterPage.present();
    const event = await filterPage.onDidDismiss();

    if (event && event.data) {
      this.filter = event.data;
      await this.filterEarthquakes();
    }

  }

}
