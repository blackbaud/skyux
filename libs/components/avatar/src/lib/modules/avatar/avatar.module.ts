import { NgModule } from '@angular/core';

import { SkyAvatarComponent } from './avatar.component';
import { SkyAvatarInnerComponent } from './avatar.inner.component';

@NgModule({
  imports: [SkyAvatarInnerComponent, SkyAvatarComponent],
  exports: [SkyAvatarComponent],
})
export class SkyAvatarModule {}
