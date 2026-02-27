import { NgModule } from '@angular/core';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyRepeaterModule } from '@skyux/lists';
import { SkyDropdownModule } from '@skyux/popovers';

import { RepeaterHarnessTestComponent } from './repeater-harness-test.component';

@NgModule({
  imports: [
    SkyRepeaterModule,
    SkyInputBoxModule,
    SkyDropdownModule],
  declarations: [RepeaterHarnessTestComponent],
})
export class RepeaterHarnessTestModule {}
