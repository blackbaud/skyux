import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TextHighlightComponent } from './text-highlight.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TextHighlightComponent,
    data: {
      name: 'Text highlight',
      icon: 'search',
      library: 'indicators',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextHighlightRoutingModule {
  public static routes = routes;
}
