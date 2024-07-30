import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyFileAttachmentsModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { FileAttachmentComponent } from './file-attachment.component';

const routes: Routes = [{ path: '', component: FileAttachmentComponent }];
@NgModule({
  declarations: [FileAttachmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    SkyFileAttachmentsModule,
    SkyStatusIndicatorModule,
    SkyHelpInlineModule,
  ],
  exports: [FileAttachmentComponent],
})
export class FileAttachmentModule {}
