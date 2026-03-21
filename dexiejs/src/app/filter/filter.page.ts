import { Component, Input, inject } from '@angular/core';
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
  ModalController
} from "@ionic/angular/standalone";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrl: './filter.page.scss',
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonRange, IonRadioGroup, IonSelect, IonSelectOption, IonRadio]
})
export class FilterPage {
  private readonly modalCtrl = inject(ModalController);

  @Input({required: true})
  filter!: Filter;

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
