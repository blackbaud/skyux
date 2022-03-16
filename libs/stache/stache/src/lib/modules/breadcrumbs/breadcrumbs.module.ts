import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { StacheNavModule } from '../nav/nav.module';

import { StacheBreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  declarations: [StacheBreadcrumbsComponent],
  imports: [CommonModule, StacheNavModule],
  exports: [StacheBreadcrumbsComponent],
})
export class StacheBreadcrumbsModule {}
