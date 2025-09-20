import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyFileAttachmentsModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { SingleFileAttachmentComponent } from './single-file-attachment.component';

const routes: Routes = [{ path: '', component: SingleFileAttachmentComponent }];
@NgModule({
  declarations: [SingleFileAttachmentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SkyFileAttachmentsModule,
    SkyHelpInlineModule,
  ],
  exports: [SingleFileAttachmentComponent],
})
export class SingleFileAttachmentModule {}
