import { NgModule } from '@angular/core';

import { OverlayChildTestComponent } from './overlay-child.component';
import { OverlayContentsTestComponent } from './overlay-contents.component';
import { OverlayHarnessTestComponent } from './overlay-harness-test.component';

@NgModule({
  declarations: [
    OverlayChildTestComponent,
    OverlayContentsTestComponent,
    OverlayHarnessTestComponent,
  ],
})
export class OverlayHarnessTestModule {}
