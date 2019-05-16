import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  SkyDocsCodeExampleComponent
} from './code-example.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    SkyDocsCodeExampleComponent
  ],
  exports: [
    SkyDocsCodeExampleComponent
  ]
})
export class SkyDocsCodeExampleModule { }
