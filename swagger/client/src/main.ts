import { provideRouter, RouteReuseStrategy, Routes, withHashLocation } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideApi } from './app/swagger';
import { environment } from './environments/environment';
import { HomePage } from './app/home/home.page';
import { EditPage } from './app/edit/edit.page';
import { AppComponent } from './app/app.component';
import { provideZoneChangeDetection } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePage },
  { path: 'edit', component: EditPage },
  { path: '**', redirectTo: 'home' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),
    provideIonicAngular(),
    provideApi({ basePath: environment.basePath }),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideHttpClient(withInterceptorsFromDi()),
    provideRouter(routes, withHashLocation()),
  ],
}).catch((err) => console.error(err));
