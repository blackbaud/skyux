import { NgModule } from '@angular/core';

import { PreviewWrapperModule } from './preview-wrapper/preview-wrapper.module';

@NgModule({
  exports: [PreviewWrapperModule],
})
export class StorybookModule {}
