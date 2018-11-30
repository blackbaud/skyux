import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  MyLibrarySampleComponent
} from './sample.component';

@NgModule({
  declarations: [
    MyLibrarySampleComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MyLibrarySampleComponent
  ]
})
export class MyLibrarySampleModule { }
