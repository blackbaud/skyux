import { NgModule } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';

import { ButtonsRoutingModule } from './buttons-routing.module';
import { ButtonsComponent } from './buttons.component';

@NgModule({
  declarations: [ButtonsComponent],
  imports: [ButtonsRoutingModule, SkyIconModule],
})
export class ButtonsModule {
  public static routes = ButtonsRoutingModule.routes;
}
