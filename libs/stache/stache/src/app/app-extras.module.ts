import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyAlertModule
} from '@skyux/indicators';

import {
  SkyFluidGridModule
} from '@skyux/layout';

import {
  SkyNavbarModule
} from '@skyux/navbar';

import {
  StacheActionButtonsModule,
  StacheAffixModule,
  StacheBlockquoteModule,
  StacheCodeModule,
  StacheIncludeModule,
  StacheMarkdownModule,
  StachePageAnchorModule,
  StachePageSummaryModule,
  StacheSidebarModule,
  StacheTutorialModule,
  StacheWrapperModule
} from './public';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyCodeBlockModule,
    SkyFluidGridModule,
    SkyNavbarModule,
    StacheActionButtonsModule,
    StacheAffixModule,
    StacheBlockquoteModule,
    StacheCodeModule,
    StacheIncludeModule,
    StacheMarkdownModule,
    StachePageAnchorModule,
    StachePageSummaryModule,
    StacheSidebarModule,
    StacheTutorialModule,
    StacheWrapperModule
  ]
})
export class AppExtrasModule { }
