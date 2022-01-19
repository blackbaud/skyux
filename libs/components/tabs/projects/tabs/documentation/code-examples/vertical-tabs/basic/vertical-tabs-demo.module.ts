import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { VerticalTabDemoComponent } from './vertical-tabs-demo.component';

@NgModule({
  imports: [CommonModule, SkyVerticalTabsetModule],
  declarations: [VerticalTabDemoComponent],
  exports: [VerticalTabDemoComponent],
})
export class SkyVerticalTabDemoModule {}
