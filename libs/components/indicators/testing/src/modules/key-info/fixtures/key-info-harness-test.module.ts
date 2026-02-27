import { NgModule } from '@angular/core';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { KeyInfoHarnessTestComponent } from './key-info-harness-test.component';

@NgModule({
  declarations: [KeyInfoHarnessTestComponent],
  imports: [SkyKeyInfoModule],
  exports: [KeyInfoHarnessTestComponent],
})
export class KeyInfoHarnessTestModule {}
