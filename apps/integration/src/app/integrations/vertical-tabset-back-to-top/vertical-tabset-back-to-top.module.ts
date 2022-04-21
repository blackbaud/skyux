import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { VerticalTabsetBackToTopRoutingModule } from './vertical-tabset-back-to-top-routing.module';
import { VerticalTabsetBackToTopComponent } from './vertical-tabset-back-to-top.component';

@NgModule({
  declarations: [VerticalTabsetBackToTopComponent],
  imports: [
    CommonModule,
    SkyBackToTopModule,
    SkyVerticalTabsetModule,
    VerticalTabsetBackToTopRoutingModule,
  ],
})
export class VerticalTabsetBackToTopModule {}
