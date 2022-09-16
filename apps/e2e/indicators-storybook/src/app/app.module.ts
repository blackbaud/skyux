import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: 'alert',
    loadChildren: () =>
      import('./alert/alert.module').then((m) => m.AlertModule),
  },
  {
    path: 'key-info',
    loadChildren: () =>
      import('./key-info/key-info.module').then((m) => m.KeyInfoModule),
  },
  {
    path: 'label',
    loadChildren: () =>
      import('./label/label.module').then((m) => m.LabelModule),
  },
];
if (routes.length > 0 && routes.findIndex((r) => r.path === '') === -1) {
  routes.push({ path: '', redirectTo: `${routes[0].path}`, pathMatch: 'full' });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
