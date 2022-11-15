import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { HelpInlineComponent } from './help-inline.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: HelpInlineComponent,
    data: {
      name: 'Help inline',
      icon: 'question',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpInlineRoutingModule {
  public static routes = routes;
}
