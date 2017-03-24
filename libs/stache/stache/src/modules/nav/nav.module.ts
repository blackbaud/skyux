import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StacheNavComponent } from './nav.component';

@NgModule({
  declarations: [
    StacheNavComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    StacheNavComponent
  ]
})
export class StacheNavModule {}
