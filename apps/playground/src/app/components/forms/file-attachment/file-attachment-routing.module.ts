import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FileAttachmentComponent } from './file-attachment.component';

export const routes: Routes = [
  {
    path: '',
    component: FileAttachmentComponent,
    data: {
      name: 'File Drop',
      icon: 'arrow-upload',
      library: 'forms',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FileAttachmentRoutingModule {}
