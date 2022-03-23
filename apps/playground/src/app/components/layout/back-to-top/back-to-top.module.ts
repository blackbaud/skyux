import { NgModule } from '@angular/core';
import { SkyBackToTopModule } from '@skyux/layout';

import { BackToTopRoutingModule } from './back-to-top-routing.module';
import { BackToTopComponent } from './basic/back-to-top.component';
import { BackToTopMessageStreamComponent } from './message-stream/back-to-top-message-stream.component';
import { BackToTopScrollableParentComponent } from './scrollable-parent/back-to-top-scrollable-parent.component';

@NgModule({
  declarations: [
    BackToTopComponent,
    BackToTopMessageStreamComponent,
    BackToTopScrollableParentComponent,
  ],
  imports: [BackToTopRoutingModule, SkyBackToTopModule],
})
export class BackToTopModule {}
