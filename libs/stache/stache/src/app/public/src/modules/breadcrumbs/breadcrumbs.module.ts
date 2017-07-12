import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav';
import { StacheBreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  declarations: [
    StacheBreadcrumbsComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule
  ],
  exports: [
    StacheBreadcrumbsComponent
  ]
})
export class StacheBreadcrumbsModule { }
