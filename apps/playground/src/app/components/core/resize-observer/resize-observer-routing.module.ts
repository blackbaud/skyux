import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResizeObserverBasicComponent } from './basic/resize-observer-basic.component';
import { ResizeObserverFlyoutComponent } from './flyout/resize-observer-flyout.component';
import { ResizeObserverBaseComponent } from './modal/resize-observer-base.component';

const routes: Routes = [
  {
    path: 'resize-observer/basic',
    component: ResizeObserverBasicComponent,
    data: {
      name: 'Resize observer (basic)',
      icon: 'arrows-h',
      library: 'core',
    },
  },
  {
    path: 'resize-observer/flyout',
    component: ResizeObserverFlyoutComponent,
    data: {
      name: 'Resize observer (flyout)',
      icon: 'arrows-h',
      library: 'core',
    },
  },
  {
    path: 'resize-observer/modal',
    component: ResizeObserverBaseComponent,
    data: {
      name: 'Resize observer (modal)',
      icon: 'arrows-h',
      library: 'core',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResizeObserverRoutingModule {
  public static routes = routes;
}
