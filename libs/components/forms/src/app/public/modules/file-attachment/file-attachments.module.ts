import {
  NgModule
} from '@angular/core';
import {
  CommonModule,
  DecimalPipe
} from '@angular/common';
import {
  FormsModule
} from '@angular/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyFormsResourcesModule
} from '../shared';

import {
  SkyFileDropComponent
} from './file-drop.component';

import {
  SkyFileItemComponent
} from './file-item.component';

import {
  SkyFileSizePipe
} from './file-size.pipe';

@NgModule({
  declarations: [
    SkyFileDropComponent,
    SkyFileItemComponent,
    SkyFileSizePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFormsResourcesModule,
    SkyIconModule,
    SkyI18nModule
  ],
  exports: [
    SkyFileDropComponent,
    SkyFileItemComponent,
    SkyFileSizePipe
  ],
  providers: [
    DecimalPipe
  ]
})
export class SkyFileAttachmentsModule { }
