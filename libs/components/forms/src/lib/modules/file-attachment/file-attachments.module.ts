import { CommonModule, DecimalPipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyIdModule, SkyTrimModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyFormsResourcesModule } from '../shared/sky-forms-resources.module';

import { SkyFileAttachmentLabelComponent } from './file-attachment-label.component';
import { SkyFileAttachmentComponent } from './file-attachment.component';
import { SkyFileDropComponent } from './file-drop.component';
import { SkyFileItemComponent } from './file-item.component';
import { SkyFileItemService } from './file-item.service';
import { SkyFileSizePipe } from './file-size.pipe';

@NgModule({
  declarations: [
    SkyFileAttachmentComponent,
    SkyFileAttachmentLabelComponent,
    SkyFileDropComponent,
    SkyFileItemComponent,
    SkyFileSizePipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SkyFormsResourcesModule,
    SkyIconModule,
    SkyIdModule,
    SkyThemeModule,
    SkyTrimModule,
  ],
  exports: [
    SkyFileAttachmentComponent,
    SkyFileAttachmentLabelComponent,
    SkyFileDropComponent,
    SkyFileItemComponent,
    SkyFileSizePipe,
  ],
  providers: [DecimalPipe, SkyFileItemService],
})
export class SkyFileAttachmentsModule {}
