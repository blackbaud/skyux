import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  BoxDemoComponent
} from './box-demo.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    BoxDemoComponent
  ],
  declarations: [
    BoxDemoComponent
  ]
})
export class BoxDemoModule { }
