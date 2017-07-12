import { NgModule } from '@angular/core';

const smoothscroll = require('smoothscroll-polyfill');
const objectAssign = require('es6-object-assign');
objectAssign.polyfill();
smoothscroll.polyfill();

import { StacheActionButtonsModule } from './modules/action-buttons/action-buttons.module';
import { StacheAffixModule } from './modules/affix/affix.module';
import { StacheAnalyticsModule } from './modules/analytics/analytics.module';
import { StacheBackToTopModule } from './modules/back-to-top/back-to-top.module';
import { StacheBreadcrumbsModule } from './modules/breadcrumbs/breadcrumbs.module';
import { StacheCodeModule } from './modules/code/code.module';
import { StacheCodeBlockModule } from './modules/code-block/code-block.module';
import { StacheGridModule } from './modules/grid/grid.module';
import { StacheHeroModule } from './modules/hero/hero.module';
import { StacheImageModule } from './modules/image/image.module';
import { StacheIncludeModule } from './modules/include/include.module';
import { StacheLayoutModule } from './modules/layout/layout.module';
import { StacheNavModule } from './modules/nav/nav.module';
import { StachePageAnchorModule } from './modules/page-anchor/page-anchor.module';
import { StachePageHeaderModule } from './modules/page-header/page-header.module';
import { StachePageSummaryModule } from './modules/page-summary/page-summary.module';
import { StacheSharedModule } from './modules/shared';
import { StacheSidebarModule } from './modules/sidebar/sidebar.module';
import { StacheTableOfContentsModule } from './modules/table-of-contents/table-of-contents.module';
import { StacheTutorialModule } from './modules/tutorial/tutorial.module';
import { StacheTutorialStepModule } from './modules/tutorial-step/tutorial-step.module';
import { StacheVideoModule } from './modules/video/video.module';
import { StacheWrapperModule } from './modules/wrapper/wrapper.module';

export * from './modules/shared';

@NgModule({
  exports: [
    StacheActionButtonsModule,
    StacheAffixModule,
    StacheAnalyticsModule,
    StacheBackToTopModule,
    StacheBreadcrumbsModule,
    StacheCodeModule,
    StacheCodeBlockModule,
    StacheGridModule,
    StacheHeroModule,
    StacheImageModule,
    StacheIncludeModule,
    StacheLayoutModule,
    StacheNavModule,
    StachePageAnchorModule,
    StachePageHeaderModule,
    StachePageSummaryModule,
    StacheSharedModule,
    StacheSidebarModule,
    StacheTableOfContentsModule,
    StacheTutorialModule,
    StacheTutorialStepModule,
    StacheVideoModule,
    StacheWrapperModule
  ]
})
export class StacheModule { }
