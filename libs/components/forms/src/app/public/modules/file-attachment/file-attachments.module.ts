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
  SkyIconModule
} from '@skyux/indicators';

import {
  SkyFileDropComponent
} from './file-drop.component';
import {
  SkyFileItemComponent
} from './file-item.component';
import {
  SkyFileSizePipe
} from './file-size.pipe';

import {
  SkyI18nModule
} from '@skyux/i18n/modules/i18n/i18n.module';

@NgModule({
  declarations: [
    SkyFileDropComponent,
    SkyFileItemComponent,
    SkyFileSizePipe
  ],
  imports: [
    CommonModule,
    FormsModule,
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
