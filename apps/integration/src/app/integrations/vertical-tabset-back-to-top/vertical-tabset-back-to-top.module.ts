import { NgModule } from '@angular/core';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { VerticalTabsetBackToTopRoutingModule } from './vertical-tabset-back-to-top-routing.module';
import { VerticalTabsetBackToTopComponent } from './vertical-tabset-back-to-top.component';

@NgModule({
  declarations: [VerticalTabsetBackToTopComponent],
  imports: [
    SkyBackToTopModule,
    SkyVerticalTabsetModule,
    VerticalTabsetBackToTopRoutingModule,
  ],
})
export class VerticalTabsetBackToTopModule {
  public static routes = VerticalTabsetBackToTopRoutingModule.routes;
}
