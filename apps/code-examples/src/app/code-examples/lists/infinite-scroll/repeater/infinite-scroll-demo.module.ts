import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyBackToTopModule } from '@skyux/layout';

import { SkyInfiniteScrollModule, SkyRepeaterModule } from '@skyux/lists';

import { InfiniteScrollDemoComponent } from './infinite-scroll-demo.component';

@NgModule({
  imports: [
    CommonModule,
    SkyBackToTopModule,
    SkyInfiniteScrollModule,
    SkyRepeaterModule,
  ],
  declarations: [InfiniteScrollDemoComponent],
  exports: [InfiniteScrollDemoComponent],
})
export class InfiniteScrollDemoModule {}
