import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { TabsSummaryActionBarComponent } from './tabs-summary-action-bar.component';

const routes = [
  {
    path: '',
    component: TabsSummaryActionBarComponent,
    data: {
      name: 'Summary action bar (tab)',
      library: 'action-bars',
      icon: 'sun-o',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsSummaryActionBarRoutingModule {
  public static routes = routes;
}
