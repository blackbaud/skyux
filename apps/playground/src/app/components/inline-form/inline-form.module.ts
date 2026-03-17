import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyInlineFormModule } from '@skyux/inline-form';

import { ComponentRouteInfo } from '../../shared/component-info/component-route-info';

import { InlineFormComponent } from './inline-form.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: InlineFormComponent,
    data: {
      name: 'Inline form',
      icon: 'edit',
      library: 'inline-form',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InlineFormRoutingModule {}

@NgModule({
  declarations: [InlineFormComponent],
  imports: [InlineFormRoutingModule, SkyInlineFormModule],
})
export class InlineFormModule {
  public static routes = routes;
}
