import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FileAttachmentTestComponent
} from './file-attachment.component.fixture';

import {
  SkyFileAttachmentsModule
} from '../file-attachments.module';

@NgModule({
  declarations: [
    FileAttachmentTestComponent
  ],
  imports: [
    SkyFileAttachmentsModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  exports: [
    FileAttachmentTestComponent
  ]
})
export class FileAttachmentTestModule { }
