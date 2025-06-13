import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyTokensModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyFilterBarResourcesModule } from '../shared/sky-filter-bar-resources.module';

import { SkyFilterBarComponent } from './filter-bar.component';

@NgModule({
  imports: [
    CommonModule,
    SkyFilterBarComponent,
    SkyFilterBarResourcesModule,
    SkyIconModule,
    SkyTokensModule,
    SkyThemeModule,
  ],
  exports: [SkyFilterBarComponent],
})
export class SkyFilterBarModule {}
