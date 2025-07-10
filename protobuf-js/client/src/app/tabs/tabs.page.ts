import {Component} from '@angular/core';
import {addIcons} from "ionicons";
import {cloudDownloadOutline} from "ionicons/icons";
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs} from "@ionic/angular/standalone";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
    IonLabel
  ]
})
export class TabsPage {
  constructor() {
    addIcons({cloudDownloadOutline});
  }
}
