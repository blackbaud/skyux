import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { CardComponent } from './card.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: CardComponent,
    data: {
      name: 'Card',
      icon: 'contact-card',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CardRoutingModule {
  public static routes = routes;
}
