import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ContactPage} from "./contact";

@NgModule({
  declarations: [ContactPage],
  imports: [IonicPageModule.forChild(ContactPage)],
})
export class ContactModule {
}
