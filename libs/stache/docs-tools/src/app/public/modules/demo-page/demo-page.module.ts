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
import { SkyDocsDemoPageTypeDefinitionsProvider } from './demo-page-type-definitions-provider';
import { SkyDocsDemoPageTypeDefinitionsComponent } from './demo-page-type-definitions.component';
import { SkyDocsMarkdownModule } from '../markdown/markdown.module';
import { SkyCodeBlockModule, SkyCodeModule } from '@blackbaud/skyux-lib-code-block';

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
    SkyDocsDemoModule,
    SkyDocsCodeExamplesModule,
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageDesignGuidelinesComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsTypeDefinitionsModule,
    SkyDocsDemoPageTypeDefinitionsComponent
  ],
  providers: [
    SkyDocsDemoPageTitleService,
    SkyDocsDemoPageTypeDefinitionsProvider
  ]
})
export class SkyDocsDemoPageModule { }
