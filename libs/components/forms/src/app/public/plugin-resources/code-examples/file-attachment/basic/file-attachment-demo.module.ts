import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  SkyFileAttachmentsModule
} from '@skyux/forms';

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  FileAttachmentDemoComponent
} from './file-attachment-demo.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyAlertModule,
    SkyFileAttachmentsModule
  ],
  declarations: [
    FileAttachmentDemoComponent
  ],
  exports: [
    FileAttachmentDemoComponent
  ]
})

export class SkyFileAttachmentDemoModule {
}
