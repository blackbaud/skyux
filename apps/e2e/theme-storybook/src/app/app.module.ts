import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: 'borders',
    loadChildren: () =>
      import('./borders/borders.module').then((m) => m.BordersModule),
  },
  {
    path: 'buttons',
    loadChildren: () =>
      import('./buttons/buttons.module').then((m) => m.ButtonsModule),
  },
  {
    path: 'responsive',
    loadChildren: () =>
      import('./responsive/responsive.module').then((m) => m.ResponsiveModule),
  },
  {
    path: 'switch-controls',
    loadChildren: () =>
      import('./switch-controls/switch-controls.module').then(
        (m) => m.SwitchControlsModule,
      ),
  },
  {
    path: 'theming',
    loadChildren: () =>
      import('./theming/theming.module').then((m) => m.ThemingModule),
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
