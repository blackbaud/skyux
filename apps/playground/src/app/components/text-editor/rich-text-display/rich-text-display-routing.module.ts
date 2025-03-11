import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { RichTextDisplayComponent } from './rich-text-display.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: RichTextDisplayComponent,
    data: {
      name: 'Rich text display',
      icon: 'document-text',
      library: 'text-editor',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class RichTextDisplayRoutingModule {
  public static routes = routes;
}
