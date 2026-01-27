import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyKeyInfoModule } from '@skyux/indicators';

import { KeyInfoHarnessTestComponent } from './key-info-harness-test.component';

@NgModule({
  declarations: [KeyInfoHarnessTestComponent],
  imports: [SkyKeyInfoModule, NoopAnimationsModule],
  exports: [KeyInfoHarnessTestComponent],
})
export class KeyInfoHarnessTestModule {}
