import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheNavComponent } from './nav.component';
import { StacheSidebarComponent } from './sidebar.component';
import { StachePageContentsComponent } from './page-contents.component';
import { StacheBreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  declarations: [
    StacheNavComponent,
    StacheSidebarComponent,
    StachePageContentsComponent,
    StacheBreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    StacheNavComponent,
    StacheSidebarComponent,
    StachePageContentsComponent,
    StacheBreadcrumbsComponent
  ]
})
export class StacheNavModule {}
