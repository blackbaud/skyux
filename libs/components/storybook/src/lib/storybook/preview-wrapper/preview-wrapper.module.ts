import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyE2eThemeSelectorModule } from '../../theme-selector/theme-selector.module';

import { PreviewWrapperComponent } from './preview-wrapper.component';

@NgModule({
  declarations: [PreviewWrapperComponent],
  exports: [PreviewWrapperComponent],
  imports: [CommonModule, SkyE2eThemeSelectorModule, SkyThemeModule],
})
export class PreviewWrapperModule {}
