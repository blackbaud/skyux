import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheActionButtonsModule } from '../action-buttons';
import { StacheAffixModule } from '../affix';
import { StacheBackToTopModule } from '../back-to-top';
import { StacheNavModule } from '../nav';
import { StacheBreadcrumbsModule } from '../breadcrumbs';
import { StacheEditButtonModule } from '../edit-button';
import { StacheSidebarModule } from '../sidebar';
import { StacheTableOfContentsModule } from '../table-of-contents';
import { StacheGridModule } from '../grid';
import { StachePageHeaderModule } from '../page-header';
import { StachePageAnchorModule } from '../page-anchor';
import { StachePageSummaryModule } from '../page-summary';

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
    StacheEditButtonModule,
    StacheSidebarModule,
    StacheTableOfContentsModule,
    StachePageSummaryModule,
    StachePageHeaderModule,
    StachePageAnchorModule
  ],
  declarations: [
    StacheLayoutComponent,
    StacheLayoutBlankComponent,
    StacheLayoutContainerComponent,
    StacheLayoutSidebarComponent,
    StacheContainerComponent
  ],
  exports: [
    StacheLayoutComponent,
    StacheContainerComponent
  ],
  providers: []
})
export class StacheLayoutModule { }
