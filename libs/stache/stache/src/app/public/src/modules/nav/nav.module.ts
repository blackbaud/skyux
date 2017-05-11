import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheNavComponent } from './nav.component';
import { StacheNavService } from './nav.service';

@NgModule({
  declarations: [
    StacheNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule
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
