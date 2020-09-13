import {Component, Input} from '@angular/core';
import {IEarthquake} from '../protos/earthquake';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent {

  @Input()
  earthquake!: IEarthquake;

}
