import { Injectable } from '@angular/core';

import { StacheDemoComponent } from './demo-component';

@Injectable()
export class StacheDemoComponentService {
  private components: StacheDemoComponent[] = [
    {
      name: 'Stache Wrapper',
      route: '/components/wrapper',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'wrapper-demo.component.html',
            fileContents: require('!!raw!./wrapper/wrapper-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'wrapper-demo.component.ts',
            fileContents: require('!!raw!./wrapper/wrapper-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Layout',
      route: '/components/layout',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'layout-demo.component.html',
            fileContents: require('!!raw!./layout/layout-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'layout-demo.component.ts',
            fileContents: require('!!raw!./layout/layout-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Layout: Sidebar',
      route: '/components/layout-sidebar',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'layout-sidebar-demo.component.html',
            fileContents: require('!!raw!./layout-sidebar/layout-sidebar-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'layout-sidebar-demo.component.ts',
            fileContents: require('!!raw!./layout-sidebar/layout-sidebar-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Page Header',
      route: '/components/page-header',
      summary: `This is the Page Header component.`,
      getCodeFiles: () => {
        return [
          {
            name: 'page-header-demo.component.html',
            fileContents: require('!!raw!./page-header/page-header-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'page-header-demo.component.ts',
            fileContents: require('!!raw!./page-header/page-header-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Page Anchor',
      route: '/components/page-anchor',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'page-anchor-demo.component.html',
            fileContents: require('!!raw!./page-anchor/page-anchor-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'page-anchor-demo.component.ts',
            fileContents: require('!!raw!./page-anchor/page-anchor-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Page Contents',
      route: '/components/table-of-contents',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'table-of-contents-demo.component.html',
            fileContents: require('!!raw!./table-of-contents/table-of-contents-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'table-of-contents-demo.component.ts',
            fileContents: require('!!raw!./table-of-contents/table-of-contents-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Sidebar',
      route: '/components/sidebar',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'sidebar-demo.component.html',
            fileContents: require('!!raw!./sidebar/sidebar-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'sidebar-demo.component.ts',
            fileContents: require('!!raw!./sidebar/sidebar-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Grid',
      route: '/components/grid',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'grid-demo.component.html',
            fileContents: require('!!raw!./grid/grid-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'grid-demo.component.ts',
            fileContents: require('!!raw!./grid/grid-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
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
