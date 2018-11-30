import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StacheCodeBlockComponent } from './code-block.component';
import { SkyAppRuntimeModule } from '@blackbaud/skyux-builder/runtime';

require('style-loader!prismjs/themes/prism.css');

@NgModule({
  declarations: [
    StacheCodeBlockComponent
  ],
  imports: [
    CommonModule,
    SkyAppRuntimeModule
  ],
  exports: [
    StacheCodeBlockComponent
  ]
})
export class CodeBockModule { }
