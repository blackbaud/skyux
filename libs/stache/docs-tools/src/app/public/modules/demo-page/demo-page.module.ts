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
  SkyDocsPropertyDefinitionsModule
} from '../property-definitions';

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

import { SkyDocsDirectiveDefinitionModule } from '../directive-definition/directive-definition.module';
import { SkyDocsInterfaceDefinitionModule } from '../interface-definition/interface-definition.module';
import { SkyDocsMethodDefinitionModule } from '../method-definition/method-definition.module';

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
    SkyDocsDirectiveDefinitionModule,
    SkyDocsDemoPageComponent,
    SkyDocsDemoPageDesignGuidelinesComponent,
    SkyDocsDemoPageSectionComponent,
    SkyDocsDemoPageSummaryComponent,
    SkyDocsInterfaceDefinitionModule,
    SkyDocsMethodDefinitionModule,
    SkyDocsPropertyDefinitionsModule
  ],
  providers: [
    SkyDocsDemoPageTitleService
  ]
})
export class SkyDocsDemoPageModule { }
