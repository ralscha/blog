import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)},
  {path: 'edit', loadChildren: () => import('./pages/edit/edit.module').then(m => m.EditPageModule)},
  {path: 'edit/:id', loadChildren: () => import('./pages/edit/edit.module').then(m => m.EditPageModule)},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules, useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
