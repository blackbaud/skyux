import { NgModule } from '@angular/core';
import { SkyLabelModule } from '@skyux/indicators';

import { LabelHarnessTestComponent } from './label-harness-test.component';

@NgModule({
  declarations: [LabelHarnessTestComponent],
  imports: [SkyLabelModule],
  exports: [LabelHarnessTestComponent],
})
export class LabelHarnessTestModule {}
