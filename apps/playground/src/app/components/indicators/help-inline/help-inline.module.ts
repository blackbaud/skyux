import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

import { ComponentRouteInfo } from '../../../shared/component-info/component-route-info';

import { HelpInlineComponent } from './help-inline.component';

const routes: ComponentRouteInfo[] = [
  {
    path: '',
    component: HelpInlineComponent,
    data: {
      name: 'Legacy help inline',
      icon: 'question',
      library: 'indicators/help-inline',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpInlineRoutingModule {}

@NgModule({
  declarations: [HelpInlineComponent],
  imports: [
    CommonModule,
    HelpInlineRoutingModule,
    SkyHelpInlineModule,
    SkyPopoverModule,
  ],
})
export class HelpInlineModule {
  public static routes = routes;
}
