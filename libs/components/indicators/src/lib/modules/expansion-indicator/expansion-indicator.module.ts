import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SkyExpansionIndicatorComponent } from './expansion-indicator.component';
import { SkyThemeModule } from '@skyux/theme';

@NgModule({
  declarations: [SkyExpansionIndicatorComponent],
  imports: [CommonModule, SkyThemeModule],
  exports: [SkyExpansionIndicatorComponent],
})
export class SkyExpansionIndicatorModule {}
