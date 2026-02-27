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
      showLinks: true,
    },
  },
  {
    path: 'blocks-with-links-no-alert',
    loadComponent: () => import('./blocks-page/blocks-page.component'),
    data: {
      hideAlert: true,
      showLinks: true,
    },
  },
  {
    path: 'blocks-with-links-no-avatar',
    loadComponent: () => import('./blocks-page/blocks-page.component'),
    data: {
      hideAvatar: true,
      showLinks: true,
    },
  },
  {
    path: 'blocks-with-links-no-avatar-no-alert',
    loadComponent: () => import('./blocks-page/blocks-page.component'),
    data: {
      hideAlert: true,
      hideAvatar: true,
      showLinks: true,
    },
  },
  {
    path: 'blocks-tile-dashboard',
    loadComponent: () =>
      import('./blocks-tile-dashboard-page/blocks-tile-dashboard-page.component'),
    data: {
      name: 'Page (Blocks - tile dashboard)',
      icon: 'list',
      library: 'pages',
    },
  },
  {
    path: 'blocks-tile-dashboard-with-links',
    loadComponent: () =>
      import('./blocks-tile-dashboard-page/blocks-tile-dashboard-page.component'),
    data: {
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
    path: 'fit-with-links',
    loadComponent: () => import('./fit-page/fit-page.component'),
    data: {
      showLinks: true,
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
    path: 'list-with-links',
    loadComponent: () => import('./list-page/list-page.component'),
    data: {
      showLinks: true,
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
  {
    path: 'tabs-with-links',
    loadComponent: () => import('./tabs-page/tabs-page.component'),
    data: {
      showLinks: true,
    },
  },
] as Route[];
