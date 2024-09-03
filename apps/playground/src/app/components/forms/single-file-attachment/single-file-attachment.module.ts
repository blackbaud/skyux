import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkyFileAttachmentsModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyPagingModule } from '@skyux/lists';

import {
  SingleFileAttachmentRoutingModule,
  routes,
} from './single-file-attachment-routing.module';
import { SingleFileAttachmentComponent } from './single-file-attachment.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SingleFileAttachmentRoutingModule,
    SkyFileAttachmentsModule,
    SkyHelpInlineModule,
    SkyPagingModule,
  ],
  declarations: [SingleFileAttachmentComponent],
  exports: [SingleFileAttachmentComponent],
})
export class SingleFileAttachmentModule {
  public static routes = routes;
}
