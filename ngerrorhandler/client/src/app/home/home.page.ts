import {Component} from '@angular/core';
import {IonButton, IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
  ]
})
export class HomePage {
  throwError(): Error {
    throw new Error('Boom!');
  }
}
