import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheCodeBlockComponent } from './code-block.component';

require('style-loader!prismjs/themes/prism.css');

@NgModule({
  declarations: [
    StacheCodeBlockComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    StacheCodeBlockComponent
  ]
})
export class StacheCodeBlockModule { }
