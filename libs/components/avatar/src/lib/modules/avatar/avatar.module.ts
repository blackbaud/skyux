import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyErrorModule } from '@skyux/errors';
import { SkyFileAttachmentsModule, SkyFileSizePipe } from '@skyux/forms';
import { SkyThemeModule } from '@skyux/theme';

import { SkyAvatarResourcesModule } from '../shared/sky-avatar-resources.module';

import { SkyAvatarComponent } from './avatar.component';
import { SkyAvatarInnerComponent } from './avatar.inner.component';

/**
 * @docsIncludeIds SkyAvatarComponent, SkyAvatarSize, SkyAvatarSrc, SkyAvatarHarness
 */
@NgModule({
  declarations: [SkyAvatarInnerComponent, SkyAvatarComponent],
  imports: [
    CommonModule,
    SkyAvatarResourcesModule,
    SkyErrorModule,
    SkyFileAttachmentsModule,
    SkyThemeModule,
  ],
  providers: [SkyFileSizePipe],
  exports: [SkyAvatarComponent],
})
export class SkyAvatarModule {}
