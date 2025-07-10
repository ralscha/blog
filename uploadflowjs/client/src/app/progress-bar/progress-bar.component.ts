import {Component, input} from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss'
})
export class ProgressBarComponent {

  readonly progress = input.required<number>();

}
