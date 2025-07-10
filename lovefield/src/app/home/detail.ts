import {Component, input} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {IonCol, IonRow} from "@ionic/angular/standalone";

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.html',
  imports: [DecimalPipe, DatePipe, IonRow, IonCol]
})
export class DetailComponent {

  readonly earthquake = input<any>();

}
