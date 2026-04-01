import { NgModule } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';

import { BoxHarnessTestComponent } from './box-harness-test.component';

@NgModule({
  imports: [SkyBoxModule],
  declarations: [BoxHarnessTestComponent],
})
export class BoxHarnessTestModule {}
