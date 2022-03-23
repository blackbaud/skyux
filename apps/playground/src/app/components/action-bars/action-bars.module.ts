import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'summary-action-bar',
    loadChildren: () =>
      import('./summary-action-bar/summary-action-bar.module').then(
        (m) => m.SummaryActionBarModule
      ),
  },
  {
    path: 'tabs-summary-action-bar',
    loadChildren: () =>
      import('./tabs-summary-action-bar/tabs-summary-action-bar.module').then(
        (m) => m.TabsSummaryActionBarModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionBarsRoutingModule {}

@NgModule({
  imports: [ActionBarsRoutingModule],
})
export class ActionBarsModule {}
