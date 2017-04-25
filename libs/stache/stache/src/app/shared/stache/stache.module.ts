import { NgModule } from '@angular/core';

require('smoothscroll-polyfill').polyfill();

import { StacheActionButtonsModule } from './modules/action-buttons/action-buttons.module';
import { StacheBackToTopModule } from './modules/back-to-top/back-to-top.module';
import { StacheCodeModule } from './modules/code/code.module';
import { StacheCodeBlockModule } from './modules/code-block/code-block.module';
import { StacheGridModule } from './modules/grid/grid.module';
import { StacheHeroModule } from './modules/hero/hero.module';
import { StachePageAnchorModule } from './modules/page-anchor/page-anchor.module';
import { StacheNavModule } from './modules/nav/nav.module';
import { StacheBreadcrumbsModule } from './modules/breadcrumbs/breadcrumbs.module';
import { StacheSidebarModule } from './modules/sidebar/sidebar.module';
import { StacheTableOfContentsModule } from './modules/table-of-contents/table-of-contents.module';
import { StacheLayoutModule } from './modules/layout/layout.module';
import { StacheWrapperModule } from './modules/wrapper/wrapper.module';
import { StachePageHeaderModule } from './modules/page-header/page-header.module';
import { StachePageSummaryModule } from './modules/page-summary/page-summary.module';

@NgModule({
  exports: [
    StacheActionButtonsModule,
    StacheBackToTopModule,
    StacheCodeModule,
    StacheCodeBlockModule,
    StacheGridModule,
    StacheHeroModule,
    StachePageAnchorModule,
    StacheNavModule,
    StacheBreadcrumbsModule,
    StacheSidebarModule,
    StacheTableOfContentsModule,
    StachePageSummaryModule,
    StachePageHeaderModule,
    StacheLayoutModule,
    StacheWrapperModule
  ]
})
export class StacheModule { }
