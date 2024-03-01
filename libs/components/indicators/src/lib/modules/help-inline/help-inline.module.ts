import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIdModule, SkyScreenReaderLabelDirective } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyIconModule } from '../icon/icon.module';
import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyHelpInlineAriaExpandedPipe } from './help-inline-aria-expanded.pipe';
import { SkyHelpInlineComponent } from './help-inline.component';

@NgModule({
  declarations: [SkyHelpInlineComponent, SkyHelpInlineAriaExpandedPipe],
  imports: [
    CommonModule,
    SkyIconModule,
    SkyIdModule,
    SkyIndicatorsResourcesModule,
    SkyScreenReaderLabelDirective,
    SkyThemeModule,
  ],
  exports: [SkyHelpInlineComponent],
})
export class SkyHelpInlineModule {}
