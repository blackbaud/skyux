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

import {
  SkyThemeIconManifestModule
} from '@skyux/theme';

@NgModule({
  declarations: [
    SkyIconClassListPipe,
    SkyIconComponent,
    SkyIconStackComponent
  ],
  imports: [
    CommonModule,
    SkyThemeIconManifestModule
  ],
  exports: [
    SkyIconComponent,
    SkyIconStackComponent
  ]
})
export class SkyIconModule { }
