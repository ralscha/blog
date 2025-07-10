import {Component, inject, OnInit} from '@angular/core';
import {
  IonButton,
  IonItem,
  IonItemDivider,
  IonItemGroup,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonRange,
  IonSelect,
  IonSelectOption,
  NavParams,
  PopoverController
} from '@ionic/angular/standalone';
import {Filter} from '../filter';
import {FormsModule} from '@angular/forms';

@Component({
  templateUrl: 'filter.html',
  imports: [FormsModule, IonItemGroup, IonItemDivider, IonLabel, IonRange, IonRadioGroup, IonSelect, IonSelectOption, IonItem, IonRadio, IonButton]
})
export class FilterPopoverComponent implements OnInit {
  filter!: Filter;
  private readonly navParams = inject(NavParams);
  private readonly popoverController = inject(PopoverController);

  ngOnInit() {
    this.filter = this.navParams.get('filter');
  }

  apply({value}: { value: any }) {
    this.popoverController.dismiss(value);
  }
}
