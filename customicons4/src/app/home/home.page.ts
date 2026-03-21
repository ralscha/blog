import {ChangeDetectionStrategy, Component} from '@angular/core';
import {IonButton, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon
  ]
})
export class HomePage {
  readonly embeddedPhoneIcon =
    'data:image/svg+xml;utf8,<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><path d="M384 0h-288c-17.6 0-32 14.399-32 32v448c0 17.6 14.399 32 32 32h288c17.6 0 32-14.4 32-32v-448c0-17.601-14.4-32-32-32zM240 488.891c-13.746 0-24.891-11.145-24.891-24.891s11.145-24.891 24.891-24.891 24.891 11.145 24.891 24.891-11.145 24.891-24.891 24.891zM384 416h-288v-352h288v352z"></path></svg>';
}
