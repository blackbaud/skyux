import {
  NgModule
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';

import {
  SkyFileAttachmentsModule
} from '@skyux/forms';
import {
  SkyModalModule
} from '@skyux/modals';
import {
  SkyErrorModalService
} from '@skyux/errors';

import {
  SkyAvatarResourcesModule
} from '../shared';

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
    SkyFileAttachmentsModule,
    SkyModalModule
  ],
  exports: [
    SkyAvatarComponent,
    SkyAvatarInnerComponent
  ],
  providers: [SkyErrorModalService]
})
export class SkyAvatarModule { }
