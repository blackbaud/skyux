import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyIconComponent
} from './icon.component';

import {
  SkyIconClassListPipe
} from './icon-class-list.pipe';

@NgModule({
  declarations: [
    SkyIconClassListPipe,
    SkyIconComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyIconComponent
  ]
})
export class SkyIconModule { }
