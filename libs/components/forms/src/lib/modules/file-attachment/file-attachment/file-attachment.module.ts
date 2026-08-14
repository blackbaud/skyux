import { NgModule } from '@angular/core';

import { SkyFormErrorModule } from '../../form-error/form-error.module';

import { SkyFileAttachmentComponent } from './file-attachment.component';

@NgModule({
  exports: [SkyFileAttachmentComponent, SkyFormErrorModule],
  imports: [SkyFileAttachmentComponent],
})
export class SkyFileAttachmentModule {}
