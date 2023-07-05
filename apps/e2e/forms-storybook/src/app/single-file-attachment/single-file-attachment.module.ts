import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SingleFileAttachmentComponent } from './single-file-attachment.component';

const routes: Routes = [{ path: '', component: SingleFileAttachmentComponent }];
@NgModule({
  declarations: [SingleFileAttachmentComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [SingleFileAttachmentComponent],
})
export class SingleFileAttachmentModule {}
