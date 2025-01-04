import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-progress-bar',
    templateUrl: './progress-bar.component.html',
    styleUrls: ['./progress-bar.component.scss'],
    standalone: false
})
export class ProgressBarComponent {

  @Input()
  progress!: number;

}
