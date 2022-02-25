import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { SkyVerticalTabsDemoComponent } from './vertical-tabs-demo.component';

@NgModule({
  imports: [CommonModule, SkyVerticalTabsetModule],
  declarations: [SkyVerticalTabsDemoComponent],
  exports: [SkyVerticalTabsDemoComponent],
})
export class SkyVerticalTabDemoModule {}
