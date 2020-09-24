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
  SkyI18nModule
} from '@skyux/i18n';

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
    SkyFileAttachmentsModule,
    SkyI18nModule
  ],
  exports: [
    SkyAvatarComponent,
    SkyAvatarInnerComponent
  ]
})
export class SkyAvatarModule { }
