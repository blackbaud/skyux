import {
  NgModule
} from '@angular/core';

import {
  StacheActionButtonsModule
} from './modules/action-buttons/action-buttons.module';

import {
  StacheAffixModule
} from './modules/affix/affix.module';

import {
  StacheAnalyticsModule
} from './modules/analytics/analytics.module';

import {
  StacheBackToTopModule
} from './modules/back-to-top/back-to-top.module';

import {
  StacheBlockquoteModule
} from './modules/blockquote/blockquote.module';

import {
  StacheBreadcrumbsModule
} from './modules/breadcrumbs/breadcrumbs.module';

import {
  StacheEditButtonModule
} from './modules/edit-button/edit-button.module';

import {
  StacheFooterModule
} from './modules/footer/footer.module';

import {
  StacheHideFromSearchModule
} from './modules/hide-from-search/hide-from-search.module';

import {
  StacheIncludeModule
} from './modules/include/include.module';

import {
  StacheJsonDataModule
} from './modules/json-data/json-data.module';

import {
  StacheLayoutModule
} from './modules/layout/layout.module';

import {
  StacheMarkdownModule
} from './modules/markdown/markdown.module';

import {
  StacheNavModule
} from './modules/nav/nav.module';

import {
  StachePageAnchorModule
} from './modules/page-anchor/page-anchor.module';

import {
  StachePageHeaderModule
} from './modules/page-header/page-header.module';

import {
  StachePageSummaryModule
} from './modules/page-summary/page-summary.module';

import {
  StacheRouterModule
} from './modules/router/router.module';

import {
  StacheSidebarModule
} from './modules/sidebar/sidebar.module';

import {
  StacheTableOfContentsModule
} from './modules/table-of-contents/table-of-contents.module';

import {
  StacheTutorialModule
} from './modules/tutorial/tutorial.module';

import {
  StacheWrapperModule
} from './modules/wrapper/wrapper.module';

@NgModule({
  exports: [
    StacheActionButtonsModule,
    StacheAffixModule,
    StacheAnalyticsModule,
    StacheBackToTopModule,
    StacheBlockquoteModule,
    StacheBreadcrumbsModule,
    StacheEditButtonModule,
    StacheFooterModule,
    StacheHideFromSearchModule,
    StacheIncludeModule,
    StacheJsonDataModule,
    StacheLayoutModule,
    StacheMarkdownModule,
    StacheNavModule,
    StachePageAnchorModule,
    StachePageHeaderModule,
    StachePageSummaryModule,
    StacheRouterModule,
    StacheSidebarModule,
    StacheTableOfContentsModule,
    StacheTutorialModule,
    StacheWrapperModule
  ]
})
export class StacheModule { }
