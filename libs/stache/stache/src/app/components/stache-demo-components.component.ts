import { Component } from '@angular/core';

@Component({
  selector: 'stache-demo-components',
  templateUrl: './stache-demo-components.component.html'
})
export class StacheDemoComponentsComponent {
  public routes = [
    {
      label: 'Overview',
      path: ['/components']
    },
    {
      label: 'Stache Wrapper',
      path: ['wrapper']
    },
    {
      label: 'Layout',
      path: ['layout']
    },
    {
      label: 'Layout: Document',
      path: ['layout-document']
    },
    {
      label: 'Layout: Sidebar',
      path: ['layout-sidebar']
    },
    {
      label: 'Page Header',
      path: ['page-header']
    },
    {
      label: 'Page Anchor',
      path: ['page-anchor']
    },
    {
      label: 'Menu',
      path: ['menu']
    },
    {
      label: 'Grid System',
      path: ['grid']
    },
    {
      label: 'Code Block',
      path: ['code']
    },
    {
      label: 'Breadcrumbs',
      path: ['breadcrumbs']
    }
  ];
}
