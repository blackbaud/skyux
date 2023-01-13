import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkySelectionModalModule } from '@skyux/lookup';

import { SelectionModalHarnessTestComponent } from './selection-modal-harness-test.component';

@NgModule({
  declarations: [SelectionModalHarnessTestComponent],
  imports: [NoopAnimationsModule, SkySelectionModalModule],
})
export class SelectionModalHarnessTestModule {}
