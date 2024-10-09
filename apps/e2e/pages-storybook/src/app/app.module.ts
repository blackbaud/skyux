import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Route, RouterModule } from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { AppComponent } from './app.component';

const routes: Route[] = [
  {
    path: '',
    redirectTo: '/page/layouts/blocks-with-links',
    pathMatch: 'full',
  },
  {
    path: 'action-hub',
    loadChildren: () =>
      import('./action-hub/action-hub.module').then((m) => m.ActionHubModule),
  },
  {
    path: 'page/layouts',
    loadChildren: () => import('./page/layouts/routes'),
  },
];
if (routes.length > 0 && routes.findIndex((r) => r.path === '') === -1) {
  routes.push({ path: '', redirectTo: `${routes[0].path}`, pathMatch: 'full' });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    NoopAnimationsModule,
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledBlocking',
      bindToComponentInputs: true,
    }),
  ],
  providers: [provideInitialTheme('modern')],
  bootstrap: [AppComponent],
})
export class AppModule {}
