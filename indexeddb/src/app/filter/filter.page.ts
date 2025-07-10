import {Component, inject, OnInit} from '@angular/core';
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
} from '@ionic/angular/standalone';
import {Filter} from '../filter-interface';
import {FormsModule, NgForm} from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
  imports: [FormsModule, IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonContent, IonItemGroup, IonItemDivider, IonLabel, IonItem, IonRange, IonRadioGroup, IonSelect, IonSelectOption, IonRadio]
})
export class FilterPage implements OnInit {
  filter!: Filter;
  private readonly navParams = inject(NavParams);
  private readonly modalCtrl = inject(ModalController);

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
