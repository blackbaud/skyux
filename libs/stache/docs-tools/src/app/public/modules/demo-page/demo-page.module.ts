import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  StachePageAnchorModule,
  StachePageSummaryModule,
  StacheWrapperModule
} from '@blackbaud/skyux-lib-stache';

import {
  SkyDemoPageModuleInfoModule
} from './module-info/module-info.module';

import {
  SkyDemoPageSectionComponent
} from './demo-page-section.component';

import {
  SkyDemoPageSummaryComponent
} from './demo-page-summary.component';

import {
  SkyDemoPageTitleService
} from './demo-page-title.service';

import {
  SkyDemoPageComponent
} from './demo-page.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDemoPageModuleInfoModule,
    StachePageAnchorModule,
    StachePageSummaryModule,
    StacheWrapperModule
  ],
  declarations: [
    SkyDemoPageComponent,
    SkyDemoPageSectionComponent,
    SkyDemoPageSummaryComponent
  ],
  exports: [
    SkyDemoPageComponent,
    SkyDemoPageSectionComponent,
    SkyDemoPageSummaryComponent
  ],
  providers: [
    SkyDemoPageTitleService
  ]
})
export class SkyDemoPageModule { }
