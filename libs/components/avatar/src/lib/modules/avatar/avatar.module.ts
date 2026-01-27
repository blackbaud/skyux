import { NgModule } from '@angular/core';
import { SkyFileSizePipe } from '@skyux/forms';

import { SkyAvatarComponent } from './avatar.component';
import { SkyAvatarInnerComponent } from './avatar.inner.component';

@NgModule({
  imports: [SkyAvatarInnerComponent, SkyAvatarComponent],
  providers: [SkyFileSizePipe],
  exports: [SkyAvatarComponent],
})
export class SkyAvatarModule {}
