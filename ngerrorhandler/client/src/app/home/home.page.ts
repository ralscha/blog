import {Component} from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
    standalone: false
})
export class HomePage {
  throwError(): Error {
    throw new Error('Boom!');
  }
}
