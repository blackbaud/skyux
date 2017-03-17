import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheMenuModule } from '../menu/menu.module';
import { StachePageHeaderModule } from '../page-header/page-header.module';
import { StacheBreadcrumbsModule } from '../breadcrumbs/breadcrumbs.module';

import { StacheLayoutComponent } from './layout.component';
import { StacheLayoutDefaultComponent } from './default/layout-default.component';
import { StacheLayoutSidebarComponent } from './sidebar/layout-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    StacheMenuModule,
    StacheBreadcrumbsModule,
    StachePageHeaderModule
  ],
  declarations: [
    StacheLayoutComponent,
    StacheLayoutDefaultComponent,
    StacheLayoutSidebarComponent
  ],
  exports: [
    StacheLayoutComponent,
    StacheLayoutDefaultComponent,
    StacheLayoutSidebarComponent
  ],
  providers: []
})
export class StacheLayoutModule { }
