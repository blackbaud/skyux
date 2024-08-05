import { NgModule } from '@angular/core';

import { SkyFormErrorModule } from '../../form-error/form-error.module';

import { SkyFileAttachmentLabelComponent } from './file-attachment-label.component';
import { SkyFileAttachmentComponent } from './file-attachment.component';

@NgModule({
  exports: [
    SkyFileAttachmentComponent,
    SkyFileAttachmentLabelComponent,
    SkyFormErrorModule,
  ],
  imports: [SkyFileAttachmentComponent, SkyFileAttachmentLabelComponent],
})
export class SkyFileAttachmentModule {}
