import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SelectionBoxComponent } from './selection-box.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SelectionBoxComponent,
    data: {
      name: 'Selection box',
      icon: 'square',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SelectionBoxRoutingModule {
  public static routes = routes;
}
