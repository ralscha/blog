import {Component} from '@angular/core';
import {IonApp, IonRouterOutlet} from "@ionic/angular/standalone";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    IonRouterOutlet,
    IonApp
  ]
})
export class AppComponent {
}
