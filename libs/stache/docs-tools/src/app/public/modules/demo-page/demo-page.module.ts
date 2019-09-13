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
  StachePageSummaryModule,
  StacheWrapperModule
} from '@blackbaud/skyux-lib-stache';

import {
  RouterModule
} from '@angular/router';

import {
  SkyTabsModule
} from '@skyux/tabs';

import {
  SkyDocsDemoModule
} from '../demo/demo.module';

import {
  SkyDocsHeadingAnchorModule
} from '../heading-anchor/heading-anchor.module';

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
    RouterModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyDocsDemoModule,
    SkyDocsHeadingAnchorModule,
    SkyDocsMarkdownModule,
    SkyDocsModuleInfoModule,
    SkyDocsTypeDefinitionsModule,
    SkyTabsModule,
    StachePageSummaryModule,
    StacheWrapperModule
  ],
  declarations: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsDemoPageTypeDefinitionsComponent
  ],
  exports: [
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsDemoPageTypeDefinitionsComponent
  ],
  providers: [
    SkyDocsDemoPageTitleService
  ]
})
export class SkyDocsDemoPageModule { }
