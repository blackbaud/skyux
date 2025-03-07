import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { SkipLinkComponent } from './skip-link.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: SkipLinkComponent,
    data: {
      name: 'Skip link',
      library: 'a11y',
      icon: 'accessibility',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class SkipLinkRoutingModule {
  public static routes = routes;
}
