import {Component, Input} from '@angular/core';

@Component({
  selector: 'detail',
  templateUrl: 'detail.html'
})
export class DetailComponent {

  @Input()
  earthquake;

}
