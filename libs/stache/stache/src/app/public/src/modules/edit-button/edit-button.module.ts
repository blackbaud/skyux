import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheEditButtonComponent } from './edit-button.component';

@NgModule({
  declarations: [
    StacheEditButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheEditButtonComponent
  ]
})
export class StacheEditButtonModule { }
