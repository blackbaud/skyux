import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule } from '@skyux/core';
import { SkyFileAttachmentsModule, SkyInputBoxModule } from '@skyux/forms';
import {
  SkyHelpInlineModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';

import { FileAttachmentDemoComponent } from './file-attachment-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyFileAttachmentsModule,
    SkyStatusIndicatorModule,
    SkyInputBoxModule,
    SkyIdModule,
    SkyHelpInlineModule,
  ],
  declarations: [FileAttachmentDemoComponent],
  exports: [FileAttachmentDemoComponent],
})
export class SkyFileAttachmentDemoModule {}
