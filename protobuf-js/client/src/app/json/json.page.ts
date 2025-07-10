import {Component, inject, OnInit} from '@angular/core';
import {EarthquakeService} from '../earthquake.service';
import {IEarthquake} from '../protos/earthquake';
import {DetailComponent} from '../detail/detail.component';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-json',
  templateUrl: './json.page.html',
  imports: [DetailComponent, IonHeader, IonToolbar, IonTitle, IonContent, IonRefresher, IonRefresherContent, IonList, IonItem, IonLabel]
})
export class JsonPage implements OnInit {
  earthquakes: IEarthquake[] = [];
  private readonly earthquakeService = inject(EarthquakeService);

  doRefresh(event: Event): void {
    this.earthquakeService.refresh().subscribe(() => {
      this.earthquakeService
        .fetchJson()
        .subscribe(data => {
          this.earthquakes = data;
          (event as CustomEvent).detail.complete();
        });
    });
  }

  ngOnInit(): void {
    this.earthquakeService.fetchJson().subscribe(data => this.earthquakes = data);
  }

}
