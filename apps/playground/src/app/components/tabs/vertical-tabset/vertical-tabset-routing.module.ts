import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { VerticalTabsetComponent } from './vertical-tabset.component';

const routes = [
  {
    path: '',
    component: VerticalTabsetComponent,
    data: {
      name: 'Vertical tabset',
      icon: 'folder-open-o',
      library: 'tabs',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class VerticalTabsetRoutingModule {
  public static routes;
}
