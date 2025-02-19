import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@skyux/storybook/route-list').then((m) => m.RouteListComponent),
  },
  {
    path: 'ag-grid-widgets',
    loadComponent: () =>
      import('./ag-grid-widgets/ag-grid-widgets.component').then(
        (m) => m.AgGridWidgetsComponent,
      ),
  },
  {
    path: 'data-manager',
    loadChildren: () =>
      import('./data-manager/data-manager.module').then(
        (m) => m.DataManagerModule,
      ),
  },
  {
    path: 'ag-grid',
    loadChildren: () =>
      import('./ag-grid/ag-grid-stories.module').then(
        (m) => m.AgGridStoriesModule,
      ),
  },
  {
    path: 'data-entry-grid',
    loadChildren: () =>
      import('./data-entry-grid/data-entry-grid.module').then(
        (m) => m.DataEntryGridModule,
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
