import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyPopoverModule } from '@skyux/popovers';

import { PopoverHarnessTestComponent } from './popover-harness-test.component';

@NgModule({
  imports: [CommonModule, NoopAnimationsModule, SkyPopoverModule],
  declarations: [PopoverHarnessTestComponent],
})
export class PopoverHarnessTestModule {}
