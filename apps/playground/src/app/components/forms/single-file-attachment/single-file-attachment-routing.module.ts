import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SingleFileAttachmentComponent } from './single-file-attachment.component';

export const routes: Routes = [
  {
    path: '',
    component: SingleFileAttachmentComponent,
    data: {
      name: 'File Attachment',
      icon: 'arrow-upload',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SingleFileAttachmentRoutingModule {}
