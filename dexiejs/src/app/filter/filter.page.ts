import { Component, OnInit, inject } from '@angular/core';
import {Filter} from '../filter-interface';
import {FormsModule, NgForm} from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ModalController,
  NavParams
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrl: './filter.page.scss',
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonRange, IonRadioGroup, IonSelect, IonSelectOption, IonRadio]
})
export class FilterPage implements OnInit {
  private readonly navParams = inject(NavParams);
  private readonly modalCtrl = inject(ModalController);


  filter!: Filter;

  ngOnInit(): void {
    this.filter = this.navParams.get('filter');
  }

  applyFilters({value}: NgForm): void {
    this.dismiss(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dismiss(data?: any): void {
    if (data) {
      data.myLocation = this.filter.myLocation;
    }
    this.modalCtrl.dismiss(data);
  }

}
