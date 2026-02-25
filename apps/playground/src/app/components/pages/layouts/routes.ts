import { Route } from '@angular/router';

export default [
  {
    path: 'blocks-page',
    loadComponent: () => import('./blocks-page/blocks-page.component'),
    data: {
      name: 'Page (Blocks)',
      icon: 'square',
      library: 'pages',
    },
  },
  {
    path: 'blocks-tile-dashboard-page',
    loadComponent: () =>
      import(
        './blocks-page-tile-dashboard/blocks-page-tile-dashboard.component'
      ),
    data: {
      name: 'Page (Blocks - tile dashboard)',
      icon: 'square',
      library: 'pages',
    },
  },
  {
    path: 'fit-page',
    loadComponent: () => import('./fit-page/fit-page.component'),
    data: {
      name: 'Page (Fit)',
      icon: 'arrow-fit',
      library: 'pages',
    },
  },
  {
    path: 'fit-page-data-grid',
    loadComponent: () =>
      import('./fit-page-data-grid/fit-page-data-grid.component'),
    data: {
      name: 'Page (Fit) - Data Grid',
      icon: 'table',
      library: 'pages',
    },
  },
  {
    path: 'list-page',
    loadComponent: () => import('./list-page/list-page.component'),
    data: {
      name: 'Page (List)',
      icon: 'text-bullet-list',
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
      icon: 'note',
      library: 'pages',
    },
  },
] as Route[];
