import { NgModule } from '@angular/core';

import { SkyAvatarModule } from '../avatar.module';

import { AvatarTestComponent } from './avatar.component.fixture';

@NgModule({
  declarations: [AvatarTestComponent],
  imports: [SkyAvatarModule],
  exports: [AvatarTestComponent],
})
export class SkyAvatarFixturesModule {}
