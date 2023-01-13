import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { ColorpickerComponent } from './colorpicker.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: ColorpickerComponent,
    data: {
      name: 'Color picker',
      icon: 'paint-brush',
      library: 'colorpicker',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ColorpickerRoutingModule {
  public static routes = routes;
}
