import {Component, input} from '@angular/core';
import {IEarthquake} from '../protos/earthquake';
import {DatePipe, DecimalPipe} from '@angular/common';
import {IonNote} from "@ionic/angular/standalone";

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  imports: [DecimalPipe, DatePipe, IonNote]
})
export class DetailComponent {

  readonly earthquake = input.required<IEarthquake>();

}
