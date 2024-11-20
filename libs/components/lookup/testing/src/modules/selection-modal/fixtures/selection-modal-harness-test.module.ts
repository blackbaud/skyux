import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SelectionModalHarnessTestComponent } from './selection-modal-harness-test.component';

@NgModule({
  declarations: [SelectionModalHarnessTestComponent],
  imports: [NoopAnimationsModule],
})
export class SelectionModalHarnessTestModule {}
