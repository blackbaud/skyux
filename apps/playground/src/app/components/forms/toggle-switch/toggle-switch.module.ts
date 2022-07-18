import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyToggleSwitchModule } from '@skyux/forms';

import { ToggleSwitchRoutingModule } from './toggle-switch-routing.module';
import { ToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [ToggleSwitchComponent],
  imports: [CommonModule, SkyToggleSwitchModule, ToggleSwitchRoutingModule],
})
export class ToggleSwitchModule {
  public static routes = ToggleSwitchRoutingModule.routes;
}
