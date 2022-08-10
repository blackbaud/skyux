import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyFileAttachmentsModule } from '@skyux/forms';
import {
  SkyHelpInlineModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';

import {
  FileAttachmentRoutingModule,
  routes,
} from './file-attachment-routing.module';
import { FileAttachmentComponent } from './file-attachment.component';

@NgModule({
  imports: [
    CommonModule,
    FileAttachmentRoutingModule,
    FormsModule,
    SkyFileAttachmentsModule,
    SkyHelpInlineModule,
    SkyStatusIndicatorModule,
  ],
  declarations: [FileAttachmentComponent],
  exports: [FileAttachmentComponent],
})
export class FileAttachmentModule {
  public static routes = routes;
}
