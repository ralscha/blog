import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: 'detail.html'
})
export class DetailComponent {

  @Input()
  earthquake: any;

}
