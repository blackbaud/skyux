import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PreviewWrapperModule } from './preview-wrapper/preview-wrapper.module';

@NgModule({
  imports: [CommonModule],
  exports: [PreviewWrapperModule],
})
export class StorybookModule {}
