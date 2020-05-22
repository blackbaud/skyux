import {
  NgModule
} from '@angular/core';

import {
  SkyCodeBlockModule,
  SkyCodeModule
} from '@blackbaud/skyux-lib-code-block';

import {
  SkyRestrictedViewModule
} from '@blackbaud/skyux-lib-restricted-view';

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
  StacheIncludeModule,
  StacheMarkdownModule,
  StachePageAnchorModule,
  StachePageSummaryModule,
  StacheSidebarModule,
  StacheTutorialModule,
  StacheWrapperModule
} from './public/public_api';

@NgModule({
  exports: [
    SkyAlertModule,
    SkyCodeBlockModule,
    SkyCodeModule,
    SkyFluidGridModule,
    SkyRestrictedViewModule,
    SkyNavbarModule,
    StacheActionButtonsModule,
    StacheAffixModule,
    StacheBlockquoteModule,
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
