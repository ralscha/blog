import {Component, OnInit} from '@angular/core';
import {FilterPage} from '../filter/filter.page';
import {Earthquake} from '../earthquake-db';
import {EarthquakeService} from '../earthquake.service';
import {LoadingController, ModalController} from '@ionic/angular';
import {Filter} from '../filter-interface';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
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
    time: '-1',
    sort: 'time',
    myLocation: null
  };

  constructor(private readonly earthquakeService: EarthquakeService,
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

      this.earthquakeService.initProvider()
        .then(() => this.filterEarthquakes())
        .catch(err => console.log(err));

    }, error => {
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

  doRefresh(refresher) {
    this.earthquakeService.initProvider()
      .then(() => this.filterEarthquakes(true))
      .then(() => refresher.complete());
  }

  async filterEarthquakes(hideLoading = false) {
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

  async presentFilterPage() {
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
