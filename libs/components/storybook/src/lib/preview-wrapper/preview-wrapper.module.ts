import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { PreviewWrapperComponent } from './preview-wrapper.component';

@NgModule({
  declarations: [PreviewWrapperComponent],
  exports: [PreviewWrapperComponent],
  imports: [SkyThemeModule],
})
export class PreviewWrapperModule {}
