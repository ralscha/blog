import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {DetailPage} from "../detail/detail";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit, OnDestroy {
  detailPage = DetailPage;
  data: Object;
  keys: string[] = [];

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams) {
    console.log('home: constructor');
  }

  forward() {
    this.navCtrl.push(this.detailPage, 'from push')
  }

  ngOnInit() {
    console.log('home: ngOnInit');
  }

  ngOnDestroy() {
    console.log('home: ngOnDestroy');
  }

  ionViewDidLoad() {
    console.log('home: ionViewDidLoad');
  }

  async ionViewWillEnter() {
    console.log(this.navParams);

    const fromDetail = this.navParams.get('fromDetail');
    if (fromDetail) {
      console.log('home: ionViewWillEnter: back from detail');
    } else {
      console.log('home: ionViewWillEnter: from start');
      const response = await fetch('http://numbersapi.com/1..10');
      this.data = await response.json();
      this.keys = Object.keys(this.data);
    }
  }

  ionViewDidEnter() {
    console.log('home: ionViewDidEnter');
  }

  ionViewWillLeave() {
    console.log('home: ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('home: ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('home: ionViewWillUnload');
  }

  //guards
  ionViewCanEnter() {
    console.log('home: ionViewCanEnter');
  }

  ionViewCanLeave() {
    console.log('home: ionViewCanLeave');
  }


  showDetail(key) {
    this.navCtrl.push(this.detailPage, this.data[key])
  }

}
