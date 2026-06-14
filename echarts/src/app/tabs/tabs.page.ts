import { Component, ChangeDetectionStrategy } from '@angular/core';
import { IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { podiumOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrl: './tabs.page.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [IonTabButton, IonIcon, IonLabel, IonTabBar, IonTabs],
})
export class TabsPage {
  constructor() {
    addIcons({ podiumOutline });
  }
}
