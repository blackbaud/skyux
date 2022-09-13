import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyFileAttachmentsModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

import { SingleFileAttachmentDemoComponent } from './single-file-attachment-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyFileAttachmentsModule,
    SkyHelpInlineModule,
  ],
  declarations: [SingleFileAttachmentDemoComponent],
  exports: [SingleFileAttachmentDemoComponent],
})
export class SkySingleFileAttachmentDemoModule {}
