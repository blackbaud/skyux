import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { SkyIndicatorsResourcesModule } from '../shared/sky-indicators-resources.module';

import { SkyLabelComponent } from './label.component';

/**
 * @docsIncludeIds SkyLabelComponent, SkyLabelType, SkyLabelHarness, SkyLabelHarnessFilters, IndicatorsLabelBasicExampleComponent
 */
@NgModule({
  declarations: [SkyLabelComponent],
  imports: [CommonModule, SkyIconModule, SkyIndicatorsResourcesModule],
  exports: [SkyLabelComponent],
})
export class SkyLabelModule {}
