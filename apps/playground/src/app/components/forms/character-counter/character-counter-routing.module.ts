import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { CharacterCounterComponent } from './character-counter.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: CharacterCounterComponent,
    data: {
      name: 'Character counter',
      icon: 'calculator',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CharacterCounterRoutingModule {
  public static routes = routes;
}
