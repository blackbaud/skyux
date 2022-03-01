import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyPopoverModule } from '@skyux/popovers';

import { PopoverDemoComponent } from './popover-demo.component';

@NgModule({
  imports: [CommonModule, SkyPopoverModule],
  declarations: [PopoverDemoComponent],
  exports: [PopoverDemoComponent],
})
export class PopoverDemoModule {}
