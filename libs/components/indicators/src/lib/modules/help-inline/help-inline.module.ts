import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyThemeModule } from '@skyux/theme';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyHelpInlineAriaExpandedPipe } from './help-inline-aria-expanded.pipe';
import { SkyHelpInlineComponent } from './help-inline.component';

@NgModule({
  declarations: [SkyHelpInlineComponent, SkyHelpInlineAriaExpandedPipe],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIndicatorsResourcesModule,
    SkyThemeModule,
  ],
  exports: [SkyHelpInlineComponent],
})
export class SkyHelpInlineModule {}
