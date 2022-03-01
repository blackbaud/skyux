import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeModule } from '@skyux/theme';

import { SkyExpansionIndicatorComponent } from './expansion-indicator.component';

@NgModule({
  declarations: [SkyExpansionIndicatorComponent],
  imports: [CommonModule, SkyThemeModule],
  exports: [SkyExpansionIndicatorComponent],
})
export class SkyExpansionIndicatorModule {}
