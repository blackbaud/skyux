import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyTokensModule } from '@skyux/indicators';
import { SkyThemeModule } from '@skyux/theme';

import { SkyFilterBarResourcesModule } from '../shared/sky-filter-bar-resources.module';

import { SkyToolbarFilterComponent } from './toolbar-filter.component';

@NgModule({
  imports: [
    CommonModule,
    SkyIconModule,
    SkyFilterBarResourcesModule,
    SkyTokensModule,
    SkyToolbarFilterComponent,
    SkyThemeModule,
  ],
  exports: [SkyToolbarFilterComponent],
})
export class SkyToolbarFilterModule {}
