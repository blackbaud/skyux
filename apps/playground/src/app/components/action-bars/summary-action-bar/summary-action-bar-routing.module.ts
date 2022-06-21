import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SummaryActionBarComponent } from './summary-action-bar.component';

const routes = [
  {
    path: '',
    component: SummaryActionBarComponent,
    data: {
      name: 'Summary action bar (basic)',
      library: 'action-bars',
      icon: 'sun-o',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SummaryActionBarRoutingModule {
  public static routes = routes;
}
