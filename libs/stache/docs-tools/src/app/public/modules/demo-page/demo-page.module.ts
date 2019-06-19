import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

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
} from '../demo/demo.module';

import {
  SkyDocsMarkdownModule
} from '../markdown/markdown.module';

import {
  SkyDocsModuleInfoModule
} from '../module-info/module-info.module';

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

import {
  SkyDocsDemoPageTypeDefinitionsComponent
} from './demo-page-type-definitions.component';

@NgModule({
  imports: [
    CommonModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsDemoModule,
    SkyDocsMarkdownModule,
    SkyDocsModuleInfoModule,
    SkyDocsTypeDefinitionsModule,
    SkyTabsModule,
    StachePageAnchorModule,
    StachePageSummaryModule,
    StacheWrapperModule
  ],
  declarations: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageDesignGuidelinesComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsDemoPageTypeDefinitionsComponent
  ],
  exports: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageDesignGuidelinesComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsDemoPageTypeDefinitionsComponent
  ],
  providers: [
    SkyDocsDemoPageTitleService
  ]
})
export class SkyDocsDemoPageModule { }
