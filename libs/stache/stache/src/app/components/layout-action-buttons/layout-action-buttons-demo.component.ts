import { Component } from '@angular/core';

import { StacheNavLink } from '../../modules/nav/nav-link';

@Component({
  selector: 'stache-layout-action-buttons-demo',
  templateUrl: 'layout-action-buttons-demo.component.html'
})
export class StacheLayoutActionButtonsDemoComponent {
  public actionButtonRoutes: StacheNavLink[] = [
    {
      name: 'Layout',
      route: '/components/layout',
      path: '/components/layout',
      icon: 'map-o',
      summary: 'Basic page layouts using Stache and skyux pattern, for quick page layouts.'
    },
    {
      name: 'Layout: Sidebar',
      route: '/components/layout-sidebar',
      path: '/components/layout-sidebar',
      icon: 'columns',
      summary: 'Side bar navigation layout pattern for creating quick documentation.'
    }
  ];
}
