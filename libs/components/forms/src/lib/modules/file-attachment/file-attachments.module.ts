import { NgModule } from '@angular/core';

import { SkyFileAttachmentModule } from './file-attachment/file-attachment.module';
import { SkyFileDropModule } from './file-drop/file-drop.module';

/**
 * @deprecated Import either `SkyFileAttachmentModule` or `SkyFileDropModule`.
 */
@NgModule({
  exports: [SkyFileAttachmentModule, SkyFileDropModule],
  imports: [SkyFileAttachmentModule, SkyFileDropModule],
})
export class SkyFileAttachmentsModule {}
