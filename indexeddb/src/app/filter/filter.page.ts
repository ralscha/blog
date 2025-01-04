import {Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {Filter} from '../filter-interface';
import {NgForm} from '@angular/forms';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.page.html',
    styleUrls: ['./filter.page.scss'],
    standalone: false
})
export class FilterPage implements OnInit {

  filter!: Filter;

  constructor(private readonly navParams: NavParams,
              private readonly modalCtrl: ModalController) {
  }

  ngOnInit(): void {
    this.filter = this.navParams.get('filter');
  }

  applyFilters({value}: NgForm): void {
    this.dismiss(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dismiss(data?: any): void {
    if (data) {
      data.myLocation = this.filter.myLocation;
    }
    this.modalCtrl.dismiss(data);
  }

}
