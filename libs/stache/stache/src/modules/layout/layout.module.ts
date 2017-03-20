import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheMenuModule } from '../menu/menu.module';
import { StacheGridModule } from '../grid/grid.module';
import { StachePageHeaderModule } from '../page-header/page-header.module';
import { StacheBreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';
import { StachePageAnchorModule } from '../page-anchor/page-anchor.module';

import { StacheLayoutComponent } from './layout.component';
import { StacheLayoutDefaultComponent } from './default/layout-default.component';
import { StacheLayoutDocumentComponent } from './document/layout-document.component';
import { StacheLayoutSidebarComponent } from './sidebar/layout-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    StacheGridModule,
    StacheMenuModule,
    StacheBreadcrumbsModule,
    StachePageHeaderModule,
    StachePageAnchorModule
  ],
  declarations: [
    StacheLayoutComponent,
    StacheLayoutDefaultComponent,
    StacheLayoutDocumentComponent,
    StacheLayoutSidebarComponent
  ],
  exports: [
    StacheLayoutComponent,
    StacheLayoutDefaultComponent,
    StacheLayoutDocumentComponent,
    StacheLayoutSidebarComponent
  ],
  providers: []
})
export class StacheLayoutModule { }
