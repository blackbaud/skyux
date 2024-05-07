import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyFileAttachmentsModule } from '@skyux/forms';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

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
    ReactiveFormsModule,
    SkyFileAttachmentsModule,
    SkyStatusIndicatorModule,
  ],
  declarations: [FileAttachmentComponent],
  exports: [FileAttachmentComponent],
})
export class FileAttachmentModule {
  public static routes = routes;
}
