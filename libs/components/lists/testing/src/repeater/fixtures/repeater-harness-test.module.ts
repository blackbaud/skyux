import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyRepeaterModule } from '@skyux/lists';

import { RepeaterHarnessTestComponent } from './repeater-harness-test.component';

@NgModule({
  imports: [CommonModule, NoopAnimationsModule, SkyRepeaterModule],
  declarations: [RepeaterHarnessTestComponent],
})
export class RepeaterHarnessTestModule {}
