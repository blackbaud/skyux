import { NgModule } from '@angular/core';

import { CodeBockModule } from './modules/code-block';

@NgModule({
  exports: [
    CodeBockModule
  ]
})
export class StacheCodeBlockModule { }
