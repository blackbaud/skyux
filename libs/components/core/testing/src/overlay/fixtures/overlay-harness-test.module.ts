import { NgModule } from '@angular/core';
import { SkyOverlayModule } from '@skyux/core';

import { OverlayHarnessTestContentsComponent } from './overlay-harness-test-contents.component';
import { OverlayHarnessTestComponent } from './overlay-harness-test.component';

@NgModule({
  imports: [SkyOverlayModule],
  declarations: [
    OverlayHarnessTestComponent,
    OverlayHarnessTestContentsComponent,
  ],
})
export class OverlayHarnessTestModule {}
