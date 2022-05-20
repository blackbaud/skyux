import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyE2eThemeSelectorModule } from '../../theme-selector/theme-selector.module';

import { PreviewWrapperComponent } from './preview-wrapper.component';

@NgModule({
  declarations: [PreviewWrapperComponent],
  imports: [CommonModule, SkyE2eThemeSelectorModule],
})
export class PreviewWrapperModule {}
