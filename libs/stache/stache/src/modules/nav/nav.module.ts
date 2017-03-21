import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheNavComponent } from './nav.component';
import { StacheMenuComponent } from './menu.component';
import { StachePageContentsComponent } from './page-contents.component';
import { StacheBreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  declarations: [
    StacheNavComponent,
    StacheMenuComponent,
    StachePageContentsComponent,
    StacheBreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    StacheNavComponent,
    StacheMenuComponent,
    StachePageContentsComponent,
    StacheBreadcrumbsComponent
  ]
})
export class StacheNavModule {}
