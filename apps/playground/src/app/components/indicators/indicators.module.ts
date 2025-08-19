import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'alert',
    loadChildren: () =>
      import('./alert/alert.module').then((m) => m.AlertModule),
  },
  {
    path: 'help-inline-legacy',
    loadChildren: () =>
      import('./help-inline/help-inline.module').then(
        (m) => m.HelpInlineModule,
      ),
  },
  {
    path: 'icon',
    loadChildren: () => import('./icon/icon.module').then((m) => m.IconModule),
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
    path: 'status-indicator',
    loadChildren: () =>
      import('./status-indicator/status-indicator.module').then(
        (m) => m.StatusIndicatorModule,
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
    path: 'tokens',
    loadChildren: () =>
      import('./tokens/tokens.module').then((m) => m.TokensModule),
  },
  {
    path: 'wait',
    loadChildren: () => import('./wait/wait.module').then((m) => m.WaitModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndicatorsRoutingModule {}

@NgModule({
  imports: [IndicatorsRoutingModule],
})
export class IndicatorsModule {
  public static routes = routes;
}
