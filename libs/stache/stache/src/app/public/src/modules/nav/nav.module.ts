import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheNavComponent } from './nav.component';
import { StacheNavService } from './nav.service';
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
  exports: [
    StacheNavComponent,
    RouterModule
  ],
  providers: [
    StacheNavService
  ]
})
export class StacheNavModule { }
