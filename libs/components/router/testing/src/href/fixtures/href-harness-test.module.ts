import { NgModule } from '@angular/core';
import { SkyHrefModule } from '@skyux/router';

import { HrefHarnessTestComponent } from './href-harness-test.component';

@NgModule({
  declarations: [HrefHarnessTestComponent],
  exports: [HrefHarnessTestComponent],
  imports: [SkyHrefModule],
})
export class HrefHarnessTestModule {}
