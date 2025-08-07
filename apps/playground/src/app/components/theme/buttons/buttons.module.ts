import { NgModule } from '@angular/core';

import { ButtonsRoutingModule } from './buttons-routing.module';
import { ButtonsComponent } from './buttons.component';

@NgModule({
  imports: [ButtonsComponent, ButtonsRoutingModule],
})
export class ButtonsModule {
  public static routes = ButtonsRoutingModule.routes;
}
