import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyGridModule } from '@skyux/grids';
import { SkyBackToTopModule } from '@skyux/layout';
import { SkyTabsModule } from '@skyux/tabs';

import { BackToTopDemoComponent } from './back-to-top-demo.component';

@NgModule({
  imports: [CommonModule, SkyBackToTopModule, SkyGridModule, SkyTabsModule],
  declarations: [BackToTopDemoComponent],
  exports: [BackToTopDemoComponent],
})
export class BackToTopDemoModule {}
