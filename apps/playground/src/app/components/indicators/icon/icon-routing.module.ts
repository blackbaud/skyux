import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { IconDemoComponent } from './icon.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: IconDemoComponent,
    data: {
      name: 'Icon',
      icon: 'image',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IconRoutingModule {
  public static routes = routes;
}
