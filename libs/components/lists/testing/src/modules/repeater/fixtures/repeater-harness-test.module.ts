import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { RepeaterHarnessTestComponent } from './repeater-harness-test.component';

@NgModule({
  imports: [
    NoopAnimationsModule,
    SkyRepeaterModule,
    SkyInputBoxModule,
    SkyDropdownModule,
  ],
  declarations: [RepeaterHarnessTestComponent],
})
export class RepeaterHarnessTestModule {}
