import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheCodeComponent } from './code.component';

require('style!prismjs/themes/prism.css');

@NgModule({
  declarations: [
    StacheCodeComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheCodeComponent
  ]
})
export class StacheCodeModule {}
