import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { AffixComponent } from './affix.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: AffixComponent,
    data: {
      name: 'Affix',
      icon: 'arrow-up',
      library: 'core',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AffixRoutingModule {
  public static routes = routes;
}
