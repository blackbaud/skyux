import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
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
