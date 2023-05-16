/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Route } from '@angular/router';

export default [
  {
    path: 'box-page',
    loadComponent: () => import('./box-page/box-page.component'),
    data: {
      name: 'Page (Box)',
      icon: 'list',
      library: 'pages',
    },
  },
  {
    path: 'list-page',
    loadComponent: () => import('./list-page/list-page.component'),
    data: {
      name: 'Page (List)',
      icon: 'list',
      library: 'pages',
    },
  },
  {
    path: 'split-view-page',
    loadComponent: () => import('./split-view-page/split-view-page.component'),
    data: {
      name: 'Page (Split View)',
      icon: 'list',
      library: 'pages',
    },
  },
  {
    path: 'tabs-page',
    loadComponent: () => import('./tabs-page/tabs-page.component'),
    data: {
      name: 'Page (Tabs)',
      icon: 'list',
      library: 'pages',
    },
  },
] as Route[];
