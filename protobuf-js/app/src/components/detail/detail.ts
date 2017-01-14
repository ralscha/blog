import {Component, Input} from '@angular/core';
import {Earthquake} from "../../providers/earthquake";

@Component({
  selector: 'detail',
  templateUrl: 'detail.html'
})
export class DetailComponent {

  @Input()
  earthquake: Earthquake;

}
