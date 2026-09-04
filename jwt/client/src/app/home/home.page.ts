import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { exitOutline } from 'ionicons/icons';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-home',
  templateUrl: './home.page.html',
  imports: [IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent],
})
export class HomePage implements OnInit {
  user!: string | null;
  message: string | null = null;
  private readonly authService = inject(AuthService);
  private readonly httpClient = inject(HttpClient);
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  constructor() {
    addIcons({ exitOutline });
    const jwtHelper = inject(JwtHelperService);

    this.authService.authUserObservable.subscribe((jwt) => {
      if (jwt) {
        const decoded = jwtHelper.decodeToken(jwt);
        this.user = decoded.sub;
      } else {
        this.user = null;
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.httpClient.get(`${environment.serverURL}/secret`, { responseType: 'text' }).subscribe(
      (text) => {
        this.message = text;
        this.changeDetectorRef.markForCheck();
      },
      (err) => console.log(err),
    );
  }

  logout(): void {
    this.authService.logout();
  }
}
