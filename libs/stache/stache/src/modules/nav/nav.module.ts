import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheNavComponent } from './nav.component';
import { StacheSidebarComponent } from './sidebar.component';
import { StacheTableOfContentsComponent } from './table-of-contents.component';
import { StacheBreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  declarations: [
    StacheNavComponent,
    StacheSidebarComponent,
    StacheTableOfContentsComponent,
    StacheBreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    StacheNavComponent,
    StacheSidebarComponent,
    StacheTableOfContentsComponent,
    StacheBreadcrumbsComponent
  ]
})
export class StacheNavModule {}
