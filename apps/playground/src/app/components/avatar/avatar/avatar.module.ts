import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';

import { AvatarRoutingModule } from './avatar-routing.module';
import { AvatarComponent } from './avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  imports: [CommonModule, AvatarRoutingModule, SkyAvatarModule],
})
export class AvatarModule {
  public static routes = AvatarRoutingModule.routes;
}
