import {Component} from '@angular/core';
import {Actor} from "./actor";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  bondActors: Actor[];

  constructor() {
    this.bondActors = [
      new Actor("Sean", "Connery"),
      new Actor("David", "Niven"),
      new Actor("George", "Lazenby"),
      new Actor("Roger", "Moore"),
      new Actor("Timothy", "Dalton"),
      new Actor("Pierce", "Brosnan"),
      new Actor("Daniel", "Craig")
    ];
  }

}
