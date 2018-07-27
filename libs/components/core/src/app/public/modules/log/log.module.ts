import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyLogService
} from './log.service';

@NgModule({
  imports: [
    CommonModule
  ],
  providers: [
    SkyLogService
  ]
})
export class SkyLogModule { }
