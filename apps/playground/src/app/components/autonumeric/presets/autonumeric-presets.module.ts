import { NgModule } from '@angular/core';

import { AutonumericPresetsRoutingModule } from './autonumeric-presets-routing.module';
import { AutonumericPresetsComponent } from './autonumeric-presets.component';

@NgModule({
  imports: [AutonumericPresetsComponent, AutonumericPresetsRoutingModule],
})
export class AutonumericPresetsModule {
  public static routes = AutonumericPresetsRoutingModule.routes;
}
