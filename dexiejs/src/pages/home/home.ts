import {Component, OnInit} from '@angular/core';
import {LoadingController, ModalController} from 'ionic-angular';
import {Filter} from "../../filter";
import {FilterPage} from "./filter";
import {EarthquakeProvider} from "../../providers/earthquakeProvider";
import {Earthquake} from "../../providers/earthquakeDb";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {

  earthquakes: Earthquake[] = [];
  elapsedTime: number;

  geoWatchId: number;

  filter: Filter = {
    mag: {
      lower: -1,
      upper: 10
    },
    distance: {
      lower: 0,
      upper: 20000
    },
    time: -1,
    sort: 'time',
    myLocation: null
  };

  constructor(private readonly earthquakeProvider: EarthquakeProvider,
              private readonly modalCtrl: ModalController,
              private readonly loadingCtrl: LoadingController) {
  }

  ngOnInit() {
    const storedFilter = localStorage.getItem('filter');
    if (storedFilter) {
      this.filter = JSON.parse(storedFilter);
    }
    navigator.geolocation.getCurrentPosition(position => {
      this.filter.myLocation = position.coords;

      this.earthquakeProvider.initProvider()
        .then(() => this.filterEarthquakes())
        .catch(err => console.log(err));

    }, error => {
      this.filter.myLocation = {longitude: 7.5663964, latitude: 46.9268287};
      this.earthquakeProvider.initProvider()
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

  doRefresh(refresher) {
    this.earthquakeProvider.initProvider()
      .then(() => this.filterEarthquakes(true))
      .then(() => refresher.complete());
  }

  async filterEarthquakes(hideLoading = false) {
    localStorage.setItem('filter', JSON.stringify(this.filter));

    let loading = null;

    if (!hideLoading) {
      loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
    }

    const start = performance.now();
    this.earthquakes = await this.earthquakeProvider.filter(this.filter);
    this.elapsedTime = performance.now() - start;

    if (loading) {
      loading.dismiss();
    }
  }

  identify(index, item) {
    return item.id;
  }

  presentFilterPage() {
    const filterPage = this.modalCtrl.create(FilterPage, {filter: this.filter});
    filterPage.present();

    filterPage.onDidDismiss(filter => {
      if (filter) {
        this.filter = filter;
        this.filterEarthquakes();
      }
    });
  }

}
