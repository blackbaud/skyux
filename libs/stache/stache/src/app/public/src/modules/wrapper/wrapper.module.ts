import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheTitleService } from './title.service';
import { StachePageAnchorModule } from '../page-anchor/page-anchor.module';
import { StacheLayoutModule } from '../layout/layout.module';
import { StacheAnalyticsModule } from '../analytics/analytics.module';

import { StacheWrapperComponent } from './wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StacheAnalyticsModule,
    StachePageAnchorModule,
    StacheLayoutModule
  ],
  declarations: [
    StacheWrapperComponent
  ],
  exports: [
    StacheWrapperComponent
  ],
  providers: [
    StacheTitleService
  ]
})
export class StacheWrapperModule { }
