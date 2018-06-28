import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheTitleService } from './title.service';
import { StachePageAnchorModule } from '../page-anchor';
import { StacheLayoutModule } from '../layout';
import { StacheAnalyticsModule } from '../analytics';
import { StacheFooterModule } from '../footer';
import { StacheWrapperComponent } from './wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    StacheAnalyticsModule,
    StachePageAnchorModule,
    StacheLayoutModule,
    StacheFooterModule
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
