import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FileAttachmentComponent } from './file-attachment.component';

const routes: Routes = [{ path: '', component: FileAttachmentComponent }];
@NgModule({
  declarations: [FileAttachmentComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [FileAttachmentComponent],
})
export class FileAttachmentModule {}
