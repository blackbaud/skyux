import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { TextEditorComponent } from './text-editor.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: TextEditorComponent,
    data: {
      name: 'Text editor',
      icon: 'pencil-square-o',
      library: 'text-editor',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TextEditorRoutingModule {
  public static routes = routes;
}
