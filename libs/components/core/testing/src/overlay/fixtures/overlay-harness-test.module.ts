import { NgModule } from '@angular/core';
import { SkyOverlayModule } from '@skyux/core';

import { OverlayChildTestComponent } from './overlay-child.component';
import { OverlayContentsTestComponent } from './overlay-contents.component';
import { OverlayHarnessTestComponent } from './overlay-harness-test.component';

@NgModule({
  imports: [SkyOverlayModule],
  declarations: [
    OverlayChildTestComponent,
    OverlayContentsTestComponent,
    OverlayHarnessTestComponent,
  ],
})
export class OverlayHarnessTestModule {}
