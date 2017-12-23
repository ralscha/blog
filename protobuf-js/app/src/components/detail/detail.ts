import {Component, Input} from '@angular/core';
import {IEarthquake} from "../../protos/earthquake";

@Component({
  selector: 'detail',
  templateUrl: 'detail.html'
})
export class DetailComponent {

  @Input()
  earthquake: IEarthquake;

}
