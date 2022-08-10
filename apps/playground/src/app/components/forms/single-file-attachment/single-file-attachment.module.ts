import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyFileAttachmentsModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';

import {
  SingleFileAttachmentRoutingModule,
  routes,
} from './single-file-attachment-routing.module';
import { SingleFileAttachmentComponent } from './single-file-attachment.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SingleFileAttachmentRoutingModule,
    SkyFileAttachmentsModule,
    SkyHelpInlineModule,
  ],
  declarations: [SingleFileAttachmentComponent],
  exports: [SingleFileAttachmentComponent],
})
export class SingleFileAttachmentModule {
  public static routes = routes;
}
