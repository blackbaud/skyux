import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyGridModule } from '@skyux/grids';

import { SkyTabsModule } from '@skyux/tabs';

import { BackToTopDemoComponent } from './back-to-top-demo.component';
import { SkyBackToTopModule } from '@skyux/layout';

@NgModule({
  imports: [CommonModule, SkyBackToTopModule, SkyGridModule, SkyTabsModule],
  declarations: [BackToTopDemoComponent],
  exports: [BackToTopDemoComponent],
})
export class BackToTopDemoModule {}
