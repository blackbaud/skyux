import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { AutonumericPresetsComponent } from './autonumeric-presets.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: AutonumericPresetsComponent,
    data: {
      name: 'Autonumeric (presets)',
      icon: 'calculator',
      library: 'autonumeric',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AutonumericPresetsRoutingModule {
  public static routes = routes;
}
