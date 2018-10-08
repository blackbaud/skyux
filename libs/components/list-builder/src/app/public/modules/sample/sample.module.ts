import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkySampleComponent
} from './sample.component';

@NgModule({
  declarations: [
    SkySampleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkySampleComponent
  ]
})
export class SkySampleModule { }
