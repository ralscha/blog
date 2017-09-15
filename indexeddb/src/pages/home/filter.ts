import {Component, OnInit} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {Filter} from "../../filter";

@Component({
  templateUrl: 'filter.html'
})
export class FilterPage implements OnInit {

  filter: Filter;

  constructor(private readonly navParams: NavParams,
              private readonly viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.filter = this.navParams.get('filter');
  }

  applyFilters({value}) {
    this.dismiss(value);
  }

  dismiss(data?: any) {
    if (data) {
      data.myLocation = this.filter.myLocation;
      data.time = parseInt(data.time);
    }
    this.viewCtrl.dismiss(data);
  }

}
