import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyFluidGridModule, SkyPageModule } from '@skyux/layout';

import { PageDemoComponent } from './page-demo.component';

@NgModule({
  declarations: [PageDemoComponent],
  imports: [CommonModule, SkyFluidGridModule, SkyPageModule],
  exports: [PageDemoComponent],
})
export class PageDemoModule {}
