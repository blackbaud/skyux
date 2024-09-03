import { NgModule } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyPageModule } from '@skyux/pages';

import { AvatarRoutingModule } from './avatar-routing.module';
import { AvatarComponent } from './avatar.component';

@NgModule({
  declarations: [AvatarComponent],
  imports: [AvatarRoutingModule, SkyAvatarModule, SkyPageModule],
})
export class AvatarModule {
  public static routes = AvatarRoutingModule.routes;
}
