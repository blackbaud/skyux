import { NgModule } from '@angular/core';

import { SkyFileAttachmentLabelComponent } from './file-attachment-label.component';
import { SkyFileAttachmentComponent } from './file-attachment.component';

@NgModule({
  exports: [SkyFileAttachmentComponent, SkyFileAttachmentLabelComponent],
  imports: [SkyFileAttachmentComponent, SkyFileAttachmentLabelComponent],
})
export class SkyFileAttachmentModule {}
