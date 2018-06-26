import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {path: '', loadChildren: './pages/home/home.module#HomePageModule'},
  {path: 'edit', loadChildren: './pages/edit/edit.module#EditPageModule'},
  {path: 'edit/:id', loadChildren: './pages/edit/edit.module#EditPageModule'},
  {path: '**', redirectTo: '/'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
