import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { LabelDemoComponent } from './label.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: LabelDemoComponent,
    data: {
      name: 'Label',
      icon: 'tag',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelRoutingModule {
  public static routes = routes;
}
