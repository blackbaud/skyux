import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TokensComponent } from './tokens.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TokensComponent,
    data: {
      name: 'Tokens',
      icon: 'tag-multiple',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TokensRoutingModule {
  public static routes = routes;
}
