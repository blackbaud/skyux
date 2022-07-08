import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { BackToTopComponent } from './basic/back-to-top.component';
import { BackToTopMessageStreamComponent } from './message-stream/back-to-top-message-stream.component';
import { BackToTopScrollableParentComponent } from './scrollable-parent/back-to-top-scrollable-parent.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: BackToTopComponent,
    data: {
      name: 'Back to top (basic)',
      icon: 'arrow-up',
      library: 'layout',
    },
  },
  {
    path: 'message-stream',
    component: BackToTopMessageStreamComponent,
    data: {
      name: 'Back to top (message stream)',
      icon: 'arrow-up',
      library: 'layout',
    },
  },
  {
    path: 'scrollable-parent',
    component: BackToTopScrollableParentComponent,
    data: {
      name: 'Back to top (scrollable parent)',
      icon: 'arrow-up',
      library: 'layout',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class BackToTopRoutingModule {
  public static routes = routes;
}
