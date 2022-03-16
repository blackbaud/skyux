import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StacheAnalyticsModule } from '../analytics/analytics.module';
import { StacheFooterModule } from '../footer/footer.module';
import { StacheJsonDataModule } from '../json-data/json-data.module';
import { StacheLayoutModule } from '../layout/layout.module';
import { StachePageAnchorModule } from '../page-anchor/page-anchor.module';
import { StacheOmnibarAdapterService } from '../shared/omnibar-adapter.service';
import { StacheWindowRef } from '../shared/window-ref';

import { StacheTitleService } from './title.service';
import { StacheWrapperComponent } from './wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StacheAnalyticsModule,
    StacheJsonDataModule,
    StachePageAnchorModule,
    StacheLayoutModule,
    StacheFooterModule,
  ],
  declarations: [StacheWrapperComponent],
  exports: [StacheWrapperComponent],
  providers: [StacheOmnibarAdapterService, StacheTitleService, StacheWindowRef],
})
export class StacheWrapperModule {}
