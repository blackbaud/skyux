import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResizeObserverModule } from './resize-observer/resize-observer.module';
import { ViewkeeperModule } from './viewkeeper/viewkeeper.module';

const routes: Routes = [
  {
    path: 'resize-observer',
    loadChildren: () =>
      import('./resize-observer/resize-observer.module').then(
        (m) => m.ResizeObserverModule,
      ),
  },
  {
    path: 'viewkeeper',
    loadChildren: () =>
      import('./viewkeeper/viewkeeper.module').then((m) => m.ViewkeeperModule),
  },
  {
    path: 'affix',
    loadChildren: () =>
      import('./affix/affix.module').then((m) => m.AffixModule),
  },
  {
    path: 'media-query',
    loadComponent: () => import('./media-query/basic/media-query.component'),
    data: {
      name: 'Media queries',
      icon: 'circle',
      library: 'core',
    },
  },
  {
    path: 'live-announcer',
    loadComponent: () => import('./live-announcer/live-announcer.component'),
    data: {
      name: 'Live announcer',
      library: 'core',
      icon: 'accessibility',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}

@NgModule({
  imports: [CoreRoutingModule, ResizeObserverModule, ViewkeeperModule],
})
export class CoreModule {
  public static routes = routes;
}
