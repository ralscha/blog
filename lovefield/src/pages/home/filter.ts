import {Component, OnInit} from "@angular/core";
import {NavParams, ViewController} from "ionic-angular";
import {Filter} from "../../filter";

@Component({
  templateUrl: 'filter.html'
})
export class FilterPopover implements OnInit {

  filter: Filter;

  constructor(private readonly navParams: NavParams,
              private readonly viewCtrl: ViewController) {
  }

  ngOnInit() {
    this.filter = this.navParams.get('filter');
  }

  apply({value}) {
    this.viewCtrl.dismiss(value);
  }
}
