import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StachePageHeaderComponent } from './page-header.component';
import { StachePageTitleComponent } from './page-title.component';

@NgModule({
  declarations: [
    StachePageHeaderComponent,
    StachePageTitleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StachePageHeaderComponent,
    StachePageTitleComponent
  ]
})
export class StachePageHeaderModule { }
