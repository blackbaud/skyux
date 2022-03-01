import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

import { PopoverDemoComponent } from './popover-demo.component';

@NgModule({
  imports: [CommonModule, SkyHelpInlineModule, SkyPopoverModule],
  declarations: [PopoverDemoComponent],
  exports: [PopoverDemoComponent],
})
export class PopoverDemoModule {}
