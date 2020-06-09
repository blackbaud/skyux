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
  SkyIconStackComponent
} from './icon-stack.component';

import {
  SkyIconClassListPipe
} from './icon-class-list.pipe';

@NgModule({
  declarations: [
    SkyIconClassListPipe,
    SkyIconComponent,
    SkyIconStackComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SkyIconComponent,
    SkyIconStackComponent
  ]
})
export class SkyIconModule { }
