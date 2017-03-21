import { Injectable } from '@angular/core';

import { StacheDemoComponent } from './demo-component';

@Injectable()
export class StacheDemoComponentService {
  private components: StacheDemoComponent[] = [
    {
      name: 'Stache Wrapper',
      route: '/components/wrapper',
      summary: ''
    },
    {
      name: 'Layout',
      route: '/components/layout',
      summary: ''
    },
    {
      name: 'Layout: Sidebar',
      route: '/components/layout-sidebar',
      summary: ''
    },
    {
      name: 'Page Header',
      route: '/components/page-header',
      summary: `This is the Page Header component.`
    },
    {
      name: 'Page Anchor',
      route: '/components/page-anchor',
      summary: ''
    },
    {
      name: 'Page Contents',
      route: '/components/page-contents',
      summary: ''
    },
    {
      name: 'Sidebar',
      route: '/components/sidebar',
      summary: ''
    },
    {
      name: 'Grid System',
      route: '/components/grid',
      summary: ''
    },
    {
      name: 'Code Block',
      route: '/components/code',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'code-demo.component.html',
            fileContents: require('!!raw!./code/code-demo.component.html'),
            language: 'markup'
          }
        ];
      }
    },
    {
      name: 'Breadcrumbs',
      route: '/components/breadcrumbs',
      summary: 'The breadcrumbs component displays a menu at the top of the page to help users keep track of their location within the app.',
      getCodeFiles: () => {
        return [
          {
            name: 'breadcrumbs-demo.component.html',
            fileContents: require('!!raw!./breadcrumbs/breadcrumbs-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'breadcrumbs-demo.component.ts',
            fileContents: require('!!raw!./breadcrumbs/breadcrumbs-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    }
  ];

  public getAll(): StacheDemoComponent[] {
    return this.components;
  }

  public getByName(name: string): StacheDemoComponent {
    return this.components.filter(component => component.name === name)[0];
  }
}
