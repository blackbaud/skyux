import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyToggleSwitchModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';

import { ToggleSwitchRoutingModule } from './toggle-switch-routing.module';
import { ToggleSwitchComponent } from './toggle-switch.component';

@NgModule({
  declarations: [ToggleSwitchComponent],
  imports: [
    CommonModule,
    SkyHelpInlineModule,
    SkyToggleSwitchModule,
    ToggleSwitchRoutingModule,
  ],
})
export class ToggleSwitchModule {
  public static routes = ToggleSwitchRoutingModule.routes;
}
