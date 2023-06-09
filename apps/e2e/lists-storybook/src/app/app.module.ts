import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Route, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: 'repeater',
    loadChildren: () =>
      import('./repeater/repeater.module').then((m) => m.RepeaterModule),
  },
  {
    path: 'paging',
    loadChildren: () =>
      import('./paging/paging.module').then((m) => m.PagingModule),
  },
  {
    path: 'sort',
    loadChildren: () => import('./sort/sort.module').then((m) => m.SortModule),
  },
  {
    path: 'infinite-scroll',
    loadChildren: () =>
      import('./infinite-scroll/infinite-scroll.module').then(
        (m) => m.InfiniteScrollModule
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
