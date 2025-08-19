import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: 'box',
    loadChildren: () => import('./box/box.module').then((m) => m.BoxModule),
  },
  {
    path: 'fluid-grid',
    loadChildren: () =>
      import('./fluid-grid/fluid-grid.module').then((m) => m.FluidGridModule),
  },
  {
    path: 'toolbar',
    loadChildren: () =>
      import('./toolbar/toolbar.module').then((m) => m.ToolbarModule),
  },
  {
    path: 'action-button',
    loadChildren: () =>
      import('./action-button/action-button.module').then(
        (m) => m.ActionButtonModule,
      ),
  },
  {
    path: 'back-to-top',
    loadChildren: () =>
      import('./back-to-top/back-to-top.module').then((m) => m.BackToTopModule),
  },
  {
    path: 'description-list',
    loadChildren: () =>
      import('./description-list/description-list.module').then(
        (m) => m.DescriptionListModule,
      ),
  },
  {
    path: 'inline-delete',
    loadChildren: () =>
      import('./inline-delete/inline-delete.module').then(
        (m) => m.InlineDeleteModule,
      ),
  },
  {
    path: 'text-expand',
    loadChildren: () =>
      import('./text-expand/text-expand.module').then(
        (m) => m.TextExpandModule,
      ),
  },
  {
    path: 'text-expand-repeater',
    loadChildren: () =>
      import('./text-expand-repeater/text-expand-repeater.module').then(
        (m) => m.TextExpandRepeaterModule,
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
  providers: [provideInitialTheme('modern')],
  bootstrap: [AppComponent],
})
export class AppModule {}
