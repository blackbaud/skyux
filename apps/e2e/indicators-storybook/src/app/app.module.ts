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
    path: 'illustration',
    loadChildren: () =>
      import('./illustration/illustration.module').then(
        (m) => m.IllustrationModule,
      ),
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
  {
    path: 'tokens',
    loadChildren: () =>
      import('./tokens/tokens.module').then((m) => m.TokensModule),
  },
  {
    path: 'wait',
    loadChildren: () => import('./wait/wait.module').then((m) => m.WaitModule),
  },
  {
    path: 'status-indicator',
    loadChildren: () =>
      import('./status-indicator/status-indicator.module').then(
        (m) => m.StatusIndicatorModule,
      ),
  },
  {
    path: 'chevron',
    loadChildren: () =>
      import('./chevron/chevron.module').then((m) => m.ChevronModule),
  },
  {
    path: 'expansion-indicator',
    loadChildren: () =>
      import('./expansion-indicator/expansion-indicator.module').then(
        (m) => m.ExpansionIndicatorModule,
      ),
  },
  {
    path: 'text-highlight',
    loadChildren: () =>
      import('./text-highlight/text-highlight.module').then(
        (m) => m.TextHighlightModule,
      ),
  },
  {
    path: 'icon',
    loadChildren: () => import('./icon/icon.module').then((m) => m.IconModule),
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
