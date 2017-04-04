import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheBackToTopComponent } from './back-to-top.component';

@NgModule({
  declarations: [
    StacheBackToTopComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheBackToTopComponent
  ]
})
export class StacheBackToTopModule {}
