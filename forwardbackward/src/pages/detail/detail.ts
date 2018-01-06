import {Component, OnDestroy, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage implements OnInit, OnDestroy {

  from: string;

  constructor(private readonly navCtrl: NavController,
              private readonly navParams: NavParams) {
    console.log('detail: constructor');
  }

  back() {
    this.navCtrl.pop();
  }

  ngOnInit() {
    console.log('detail ngOnInit');
  }

  ngOnDestroy() {
    console.log('detail ngOnDestroy');
  }

  ionViewDidLoad() {
    console.log('detail ionViewDidLoad');
  }

  ionViewWillEnter() {
    console.log(this.navParams);

    console.log('detail ionViewWillEnter');
    this.from = this.navParams.data;
  }

  ionViewDidEnter() {
    console.log('detail ionViewDidEnter');
  }

  ionViewWillLeave() {
    this.navCtrl.getPrevious().data.fromDetail = true;
    console.log('detail ionViewWillLeave');
  }

  ionViewDidLeave() {
    console.log('detail ionViewDidLeave');
  }

  ionViewWillUnload() {
    console.log('detail ionViewWillUnload');
  }

  //guards
  ionViewCanEnter() {
    console.log('detail ionViewCanEnter');
  }

  ionViewCanLeave() {
    console.log('detail ionViewCanLeave');
  }


}
