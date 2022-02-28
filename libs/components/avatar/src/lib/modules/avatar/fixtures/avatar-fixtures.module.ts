import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyAvatarModule } from '../avatar.module';

import { AvatarTestComponent } from './avatar.component.fixture';

@NgModule({
  declarations: [AvatarTestComponent],
  imports: [CommonModule, SkyAvatarModule],
  exports: [AvatarTestComponent],
})
export class SkyAvatarFixturesModule {}
