import { Route } from '@angular/router';

export default [
  {
    path: 'blocks-page',
    loadComponent: () => import('./blocks-page/blocks-page.component'),
    data: {
      name: 'Page (Blocks)',
      icon: 'square-o',
      library: 'pages',
    },
  },
  {
    path: 'fit-page',
    loadComponent: () => import('./fit-page/fit-page.component'),
    data: {
      name: 'Page (Fit)',
      icon: 'columns',
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
    path: 'none-page',
    loadComponent: () => import('./none-page/none-page.component'),
    data: {
      name: 'Page (None)',
      icon: 'square',
      library: 'pages',
    },
  },
  {
    path: 'tabs-page',
    loadComponent: () => import('./tabs-page/tabs-page.component'),
    data: {
      name: 'Page (Tabs)',
      icon: 'folder-open-o',
      library: 'pages',
    },
  },
] as Route[];
