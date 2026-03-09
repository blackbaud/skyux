import { NgModule } from '@angular/core';

import { SkyModalBannerComponent } from './modal-banner.component';
import { SkyModalContentComponent } from './modal-content.component';
import { SkyModalFooterComponent } from './modal-footer.component';
import { SkyModalHeaderComponent } from './modal-header.component';
import { SkyModalIsDirtyDirective } from './modal-is-dirty.directive';
import { SkyModalComponent } from './modal.component';

@NgModule({
  imports: [
    SkyModalComponent,
    SkyModalBannerComponent,
    SkyModalContentComponent,
    SkyModalFooterComponent,
    SkyModalHeaderComponent,
    SkyModalIsDirtyDirective,
  ],
  exports: [
    SkyModalComponent,
    SkyModalBannerComponent,
    SkyModalContentComponent,
    SkyModalFooterComponent,
    SkyModalHeaderComponent,
    SkyModalIsDirtyDirective,
  ],
})
export class SkyModalModule {}
