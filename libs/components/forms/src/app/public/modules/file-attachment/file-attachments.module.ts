import {
  CommonModule,
  DecimalPipe
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  NgModule
} from '@angular/core';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyFileAttachmentComponent
} from './file-attachment.component';

import {
  SkyFileAttachmentLabelComponent
} from './file-attachment-label.component';

import {
  SkyFileAttachmentService
} from './file-attachment.service';

import {
  SkyFileDropComponent
} from './file-drop.component';

import {
  SkyFileItemComponent
} from './file-item.component';

import {
  SkyFileItemService
} from './file-item.service';

import {
  SkyFileSizePipe
} from './file-size.pipe';

import {
  SkyFormsResourcesModule
} from '../shared/forms-resources.module';

@NgModule({
  declarations: [
    SkyFileAttachmentComponent,
    SkyFileAttachmentLabelComponent,
    SkyFileDropComponent,
    SkyFileItemComponent,
    SkyFileSizePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFormsResourcesModule,
    SkyI18nModule,
    SkyIconModule
  ],
  exports: [
    SkyFileAttachmentComponent,
    SkyFileAttachmentLabelComponent,
    SkyFileDropComponent,
    SkyFileItemComponent,
    SkyFileSizePipe
  ],
  providers: [
    DecimalPipe,
    SkyFileAttachmentService,
    SkyFileItemService
  ]
})
export class SkyFileAttachmentsModule { }
