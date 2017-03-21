import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav/nav.module';
import { StacheGridModule } from '../grid/grid.module';
import { StachePageHeaderModule } from '../page-header/page-header.module';
import { StachePageAnchorModule } from '../page-anchor/page-anchor.module';

import { StacheLayoutComponent } from './layout.component';
import { StacheLayoutDefaultComponent } from './default/layout-default.component';
import { StacheLayoutDocumentComponent } from './document/layout-document.component';
import { StacheLayoutSidebarComponent } from './sidebar/layout-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    StacheGridModule,
    StacheNavModule,
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
