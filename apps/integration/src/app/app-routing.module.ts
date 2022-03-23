import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'integrations',
    loadChildren: () =>
      import('./integrations/integrations.module').then(
        (m) => m.IntegrationsModule
      ),
  },
  {
    path: 'flyout-with-tabs',
    loadChildren: () =>
      import('./features/flyout-with-tabs.module').then(
        (m) => m.FlyoutWithTabsModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
