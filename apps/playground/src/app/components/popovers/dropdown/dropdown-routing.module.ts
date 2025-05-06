import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { DropdownComponent } from './dropdown.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: DropdownComponent,
    data: {
      name: 'Dropdown',
      icon: 'chevron-down',
      library: 'popovers',
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild([
      ...routes,
      {
        path: 'iframe',
        loadComponent: (): Promise<any> =>
          import('./dropdown-example.component').then(
            (m) => m.DropdownExampleComponent,
          ),
        data: {
          name: 'Dropdown (iframe)',
          icon: 'chevron-down',
          library: 'popovers',
        },
      },
    ]),
  ],
  exports: [RouterModule],
})
export class DropdownRoutingModule {
  public static routes = routes;
}
