import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { IllustrationComponent } from './illustration.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: IllustrationComponent,
    data: {
      name: 'Illustration',
      icon: 'image',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IllustrationRoutingModule {
  public static routes = routes;
}
