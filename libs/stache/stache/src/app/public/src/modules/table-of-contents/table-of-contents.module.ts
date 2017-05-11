import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheNavModule } from '../nav/nav.module';
import { StacheTableOfContentsComponent } from './table-of-contents.component';

@NgModule({
  declarations: [
    StacheTableOfContentsComponent
  ],
  imports: [
    CommonModule,
    StacheNavModule
  ],
  exports: [
    StacheTableOfContentsComponent
  ]
})
export class StacheTableOfContentsModule { }
