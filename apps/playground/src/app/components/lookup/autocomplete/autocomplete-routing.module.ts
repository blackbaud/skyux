import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { AutocompleteComponent } from './autocomplete.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: AutocompleteComponent,
    data: {
      name: 'Autocomplete',
      icon: 'search',
      library: 'lookup',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AutocompleteRoutingModule {
  public static routes = routes;
}
