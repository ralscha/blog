import { ChangeDetectionStrategy, Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

register();

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {}
