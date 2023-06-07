import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: 'datepicker',
    loadChildren: () =>
      import('./datepicker/datepicker.module').then((m) => m.DatepickerModule),
  },
  {
    path: 'date-range-picker',
    loadChildren: () =>
      import('./date-range-picker/date-range-picker.module').then(
        (m) => m.DateRangePickerModule
      ),
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
