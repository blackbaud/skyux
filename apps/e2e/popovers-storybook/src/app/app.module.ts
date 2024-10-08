import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: 'popover',
    loadChildren: () =>
      import('./popover/popover.module').then((m) => m.PopoverModule),
  },
  {
    path: 'dropdown',
    loadChildren: () =>
      import('./dropdown/dropdown.module').then((m) => m.DropdownModule),
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
  providers: [provideAnimations(), provideInitialTheme('modern')],
  bootstrap: [AppComponent],
})
export class AppModule {}
