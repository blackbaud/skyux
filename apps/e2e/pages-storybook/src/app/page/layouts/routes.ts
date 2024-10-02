import { Route } from '@angular/router';

export default [
  {
    path: 'blocks',
    loadComponent: () => import('./blocks-page/blocks-page.component'),
    data: {
      name: 'Page (Blocks)',
      icon: 'list',
      library: 'pages',
    },
  },
  {
    path: 'blocks-with-links',
    loadComponent: () => import('./blocks-page/blocks-page.component'),
    data: {
      name: 'Page (Blocks)',
      icon: 'list',
      library: 'pages',
      showLinks: true,
    },
  },
  {
    path: 'fit',
    loadComponent: () => import('./fit-page/fit-page.component'),
    data: {
      name: 'Page (Fit)',
      icon: 'list',
      library: 'pages',
    },
  },
  {
    path: 'list',
    loadComponent: () => import('./list-page/list-page.component'),
    data: {
      name: 'Page (List)',
      icon: 'list',
      library: 'pages',
    },
  },
  {
    path: 'tabs',
    loadComponent: () => import('./tabs-page/tabs-page.component'),
    data: {
      name: 'Page (Tabs)',
      icon: 'list',
      library: 'pages',
    },
  },
] as Route[];
