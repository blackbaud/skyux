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
  SkyFileAttachmentsModule,
  SkyFileSizePipe
} from '@skyux/forms';

import {
  SkyI18nModule
} from '@skyux/i18n';

import {
  SkyThemeModule
} from '@skyux/theme';

import {
  SkyAvatarComponent
} from './avatar.component';

import {
  SkyAvatarInnerComponent
} from './avatar.inner.component';
import { SkyAvatarResourcesModule } from '../shared/sky-avatar-resources.module';

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
    SkyI18nModule,
    SkyThemeModule
  ],
  providers: [
    SkyFileSizePipe
  ],
  exports: [
    SkyAvatarComponent
  ]
})
export class SkyAvatarModule { }
