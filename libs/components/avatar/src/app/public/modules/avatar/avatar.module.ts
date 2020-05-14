import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  SkyErrorModule
} from '@skyux/errors';

import {
  SkyFileAttachmentsModule
} from '@skyux/forms';

import {
  SkyAvatarResourcesModule
} from '../shared/avatar-resources.module';

import {
  SkyAvatarComponent
} from './avatar.component';

import {
  SkyAvatarInnerComponent
} from './avatar.inner.component';

@NgModule({
  declarations: [
    SkyAvatarInnerComponent,
    SkyAvatarComponent
  ],
  imports: [
    CommonModule,
    SkyAvatarResourcesModule,
    SkyErrorModule,
    SkyFileAttachmentsModule
  ],
  exports: [
    SkyAvatarComponent,
    SkyAvatarInnerComponent
  ]
})
export class SkyAvatarModule { }
