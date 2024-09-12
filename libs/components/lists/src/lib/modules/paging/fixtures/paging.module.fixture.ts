import { NgModule } from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { SkyPagingModule } from '../paging.module';

import { SkyPagingWithContentTestComponent } from './paging-with-content.component.fixture';
import { SkyPagingTestComponent } from './paging.component.fixture';

@NgModule({
  declarations: [SkyPagingTestComponent],
  imports: [SkyPagingModule, SkyPagingWithContentTestComponent],
  exports: [SkyPagingTestComponent],
  providers: [SkyThemeService],
})
export class SkyPagingFixturesModule {}
