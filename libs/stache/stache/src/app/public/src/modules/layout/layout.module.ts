import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheActionButtonsModule } from '../action-buttons/action-buttons.module';
import { StacheAffixModule } from '../affix/affix.module';
import { StacheBackToTopModule } from '../back-to-top/back-to-top.module';
import { StacheNavModule } from '../nav/nav.module';
import { StacheBreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';
import { StacheSidebarModule } from '../sidebar/sidebar.module';
import { StacheTableOfContentsModule } from '../table-of-contents/table-of-contents.module';
import { StacheGridModule } from '../grid/grid.module';
import { StachePageHeaderModule } from '../page-header/page-header.module';
import { StachePageAnchorModule } from '../page-anchor/page-anchor.module';
import { StachePageSummaryModule } from '../page-summary/page-summary.module';

import { StacheContainerComponent } from './container.component';
import { StacheLayoutComponent } from './layout.component';
import { StacheLayoutBlankComponent } from './layout-blank.component';
import { StacheLayoutContainerComponent } from './layout-container.component';
import { StacheLayoutSidebarComponent } from './layout-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    StacheActionButtonsModule,
    StacheAffixModule,
    StacheBackToTopModule,
    StacheGridModule,
    StacheNavModule,
    StacheBreadcrumbsModule,
    StacheSidebarModule,
    StacheTableOfContentsModule,
    StachePageSummaryModule,
    StachePageHeaderModule,
    StachePageAnchorModule
  ],
  declarations: [
    StacheContainerComponent,
    StacheLayoutComponent,
    StacheLayoutBlankComponent,
    StacheLayoutContainerComponent,
    StacheLayoutSidebarComponent
  ],
  exports: [
    StacheContainerComponent,
    StacheLayoutComponent
  ],
  providers: []
})
export class StacheLayoutModule { }
