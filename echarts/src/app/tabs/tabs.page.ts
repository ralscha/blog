import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { podiumOutline } from 'ionicons/icons';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrl: './tabs.page.scss',
  imports: [IonTabButton, IonIcon, IonLabel, IonTabBar, IonTabs],
})
export class TabsPage {
  constructor() {
    addIcons({ podiumOutline });
  }
}
