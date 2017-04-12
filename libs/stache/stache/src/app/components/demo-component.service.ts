import { Injectable } from '@angular/core';

import { StacheDemoComponent } from './demo-component';

@Injectable()
export class StacheDemoComponentService {
  private components: StacheDemoComponent[] = [
    {
      name: 'Stache Wrapper',
      route: '/components/wrapper',
      icon: 'gift',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'wrapper-demo.component.html',
            fileContents: require('!!raw-loader!./wrapper/wrapper-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'wrapper-demo.component.ts',
            fileContents: require('!!raw-loader!./wrapper/wrapper-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Layout',
      route: '/components/layout',
      icon: 'map-o',
      summary: 'Basic page layouts using Stache and skyux pattern, for quick page layouts.',
      getCodeFiles: () => {
        return [
          {
            name: 'layout-demo.component.html',
            fileContents: require('!!raw-loader!./layout/layout-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'layout-demo.component.ts',
            fileContents: require('!!raw-loader!./layout/layout-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Layout: Sidebar',
      route: '/components/layout-sidebar',
      icon: 'columns',
      summary: 'Side bar navigation layout pattern for creating quick documentation.',
      getCodeFiles: () => {
        return [
          {
            name: 'layout-sidebar-demo.component.html',
            fileContents:
              require('!!raw-loader!./layout-sidebar/layout-sidebar-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'layout-sidebar-demo.component.ts',
            fileContents: require('!!raw-loader!./layout-sidebar/layout-sidebar-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Page Header',
      route: '/components/page-header',
      icon: 'header',
      summary: `This is the Page Header component.`,
      getCodeFiles: () => {
        return [
          {
            name: 'page-header-demo.component.html',
            fileContents: require('!!raw-loader!./page-header/page-header-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'page-header-demo.component.ts',
            fileContents: require('!!raw-loader!./page-header/page-header-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Page Summary',
      route: '/components/page-summary',
      icon: 'file-text',
      summary: 'lorem and things',
      getCodeFiles: () => {
        return [
          {
            name: 'page-summary-demo.component.html',
            fileContents: require('!!raw-loader!./page-summary/page-summary-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'page-summary-demo.component.ts',
            fileContents: require('!!raw-loader!./page-summary/page-summary-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Page Anchor',
      route: '/components/page-anchor',
      icon: 'link',
      summary: 'Anchored stuff on the page',
      getCodeFiles: () => {
        return [
          {
            name: 'page-anchor-demo.component.html',
            fileContents: require('!!raw-loader!./page-anchor/page-anchor-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'page-anchor-demo.component.ts',
            fileContents: require('!!raw-loader!./page-anchor/page-anchor-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Table of Contents',
      route: '/components/table-of-contents',
      icon: 'list-ol',
      summary: 'list of page items',
      getCodeFiles: () => {
        return [
          {
            name: 'table-of-contents-demo.component.html',
            fileContents:
              require('!!raw-loader!./table-of-contents/table-of-contents-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'table-of-contents-demo.component.ts',
            fileContents:
              require('!!raw-loader!./table-of-contents/table-of-contents-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Sidebar',
      route: '/components/sidebar',
      icon: 'columns',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'sidebar-demo.component.html',
            fileContents: require('!!raw-loader!./sidebar/sidebar-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'sidebar-demo.component.ts',
            fileContents: require('!!raw-loader!./sidebar/sidebar-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Action Buttons',
      route: '/components/action-buttons',
      icon: 'th-list',
      summary: 'Basic page layouts using Stache and skyux pattern, for quick page layouts.',
      getCodeFiles: () => {
        return [
          {
            name: 'action-buttons-demo.component.html',
            fileContents:
              require(
                `!!raw-loader!./action-buttons/action-buttons-demo.component.html`
              ),
            language: 'markup'
          },
          {
            name: 'action-buttons-demo.component.ts',
            fileContents:
              require(
                `!!raw-loader!./action-buttons/action-buttons-demo.component.ts`
              ),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Grid',
      route: '/components/grid',
      icon: 'table',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'grid-demo.component.html',
            fileContents: require('!!raw-loader!./grid/grid-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'grid-demo.component.ts',
            fileContents: require('!!raw-loader!./grid/grid-demo.component.ts'),
            language: 'typescript'
          }
        ];
      }
    },
    {
      name: 'Code Block',
      route: '/components/code-block',
      icon: 'table',
      summary: '',
      getCodeFiles: () => {
        return [
          {
            name: 'code-block-demo.component.html',
            fileContents: require('!!raw-loader!./code-block/code-block-demo.component.html'),
            language: 'markup'
          }
        ];
      }
    },
    {
      name: 'Breadcrumbs',
      route: '/components/breadcrumbs',
      icon: 'exchange',
      summary: `The breadcrumbs component displays a menu at the top of the page to 
        help users keep track of their location within the app.`,
      getCodeFiles: () => {
        return [
          {
            name: 'breadcrumbs-demo.component.html',
            fileContents: require('!!raw-loader!./breadcrumbs/breadcrumbs-demo.component.html'),
            language: 'markup'
          },
          {
            name: 'breadcrumbs-demo.component.ts',
            fileContents: require('!!raw-loader!./breadcrumbs/breadcrumbs-demo.component.ts'),
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
