import { NgModule } from '@angular/core';
import { SkyOverlayModule } from '@skyux/core';

import { OverlayHarnessTestComponent } from './overlay-harness-test.component';

@NgModule({
  imports: [SkyOverlayModule],
  declarations: [OverlayHarnessTestComponent],
})
export class OverlayHarnessTestModule {}
