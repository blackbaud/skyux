import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SectionedFormComponent } from './sectioned-form.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SectionedFormComponent,
    data: {
      name: 'Sectioned form',
      icon: 'object-group',
      library: 'tabs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SectionedFormRoutingModule {
  public static routes = routes;
}
