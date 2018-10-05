import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkyAvatarModule } from '../';
import { AvatarTestComponent } from './avatar.component.fixture';

@NgModule({
  declarations: [
    AvatarTestComponent
  ],
  imports: [
    CommonModule,
    SkyAvatarModule
  ],
  exports: [
    AvatarTestComponent
  ]
})
export class SkyAvatarFixturesModule { }
