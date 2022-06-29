import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResizeObserverModule } from './resize-observer/resize-observer.module';
import { ViewkeeperModule } from './viewkeeper/viewkeeper.module';

const routes: Routes = [
  {
    path: 'resize-observer',
    loadChildren: () =>
      import('./resize-observer/resize-observer.module').then(
        (m) => m.ResizeObserverModule
      ),
  },
  {
    path: 'viewkeeper',
    loadChildren: () =>
      import('./viewkeeper/viewkeeper.module').then((m) => m.ViewkeeperModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    ResizeObserverModule,
    ViewkeeperModule,
  ],
})
export class CoreModule {
  public static routes = routes;
}
