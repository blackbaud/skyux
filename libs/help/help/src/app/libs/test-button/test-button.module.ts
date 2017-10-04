import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestButtonComponent } from './test-button.component';

@NgModule({
  declarations: [
    TestButtonComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TestButtonComponent
  ]
})
export class TestButtonModule { }
