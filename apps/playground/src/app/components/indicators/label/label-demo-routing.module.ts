import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { LabelDemoComponent } from './label-demo.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: LabelDemoComponent,
    data: {
      name: 'Label',
      icon: 'tags',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabelDemoRoutingModule {
  public static routes = routes;
}
