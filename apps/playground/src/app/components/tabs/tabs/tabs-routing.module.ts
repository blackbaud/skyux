import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TabsComponent } from './tabs.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TabsComponent,
    data: {
      name: 'Tabs',
      icon: 'folder-open',
      library: 'tabs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsRoutingModule {
  public static routes = routes;
}
