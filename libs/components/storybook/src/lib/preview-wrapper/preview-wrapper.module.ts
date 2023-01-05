import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyThemeModule, SkyThemeService } from '@skyux/theme';

import { PreviewWrapperComponent } from './preview-wrapper.component';

@NgModule({
  declarations: [PreviewWrapperComponent],
  exports: [PreviewWrapperComponent],
  imports: [CommonModule, SkyThemeModule, NoopAnimationsModule],
  providers: [
    SkyThemeService,
    {
      provide: 'BODY',
      useValue: document.body,
    },
  ],
})
export class PreviewWrapperModule {}
