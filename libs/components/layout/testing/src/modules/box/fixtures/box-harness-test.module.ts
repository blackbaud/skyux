import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyBoxModule } from '@skyux/layout';

import { BoxHarnessTestComponent } from './box-harness-test.component';

@NgModule({
  imports: [SkyBoxModule, NoopAnimationsModule],
  declarations: [BoxHarnessTestComponent],
})
export class BoxHarnessTestModule {}
