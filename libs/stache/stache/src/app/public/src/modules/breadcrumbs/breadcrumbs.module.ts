import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav';
import { StacheBreadcrumbsComponent } from './breadcrumbs.component';
import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StacheBreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule,
    StacheLinkModule
  ],
  exports: [
    StacheBreadcrumbsComponent
  ]
})
export class StacheBreadcrumbsModule { }
