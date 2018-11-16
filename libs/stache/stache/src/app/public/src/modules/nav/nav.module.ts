import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheNavComponent } from './nav.component';
import { StacheLinkModule } from '../link';

@NgModule({
  declarations: [
    StacheNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    StacheLinkModule
  ],
  providers: [],
  exports: [
    StacheNavComponent
  ]
})
export class StacheNavModule { }
