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
  SkyTabsModule
} from '@skyux/tabs';

import {
  SkyDocsDemoModule
} from '../demo';

import {
  SkyDocsCodeExamplesModule
} from '../code-examples';

import {
  SkyDocsModuleInfoModule
} from '../module-info';

import {
  SkyDocsTypeDefinitionsModule
} from '../type-definitions/type-definitions.module';

import {
  SkyDocsDemoPageDesignGuidelinesComponent
} from './demo-page-design-guidelines.component';

import {
  SkyDocsDemoPageSectionComponent
} from './demo-page-section.component';

import {
  SkyDocsDemoPageSummaryComponent
} from './demo-page-summary.component';

import {
  SkyDocsDemoPageTitleService
} from './demo-page-title.service';

import {
  SkyDocsDemoPageComponent
} from './demo-page.component';

@NgModule({
  imports: [
    CommonModule,
    SkyDocsDemoModule,
    SkyDocsModuleInfoModule,
    SkyTabsModule,
    StachePageAnchorModule,
    StachePageSummaryModule,
    StacheWrapperModule
  ],
  declarations: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageDesignGuidelinesComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent
  ],
  exports: [
    SkyDocsDemoModule,
    SkyDocsCodeExamplesModule,
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageDesignGuidelinesComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsTypeDefinitionsModule
  ],
  providers: [
    SkyDocsDemoPageTitleService
  ]
})
export class SkyDocsDemoPageModule { }
