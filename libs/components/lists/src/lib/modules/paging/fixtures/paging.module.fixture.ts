import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { SkyPagingModule } from '../paging.module';

import { SkyPagingTestComponent } from './paging.component.fixture';

@NgModule({
  declarations: [SkyPagingTestComponent],
  imports: [CommonModule, SkyPagingModule],
  exports: [SkyPagingTestComponent],
  providers: [SkyThemeService],
})
export class SkyPagingFixturesModule {}
