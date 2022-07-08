import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  SkyHelpInlineModule,
  SkyStatusIndicatorModule,
} from '@skyux/indicators';

import { StatusIndicatorRoutingModule } from './status-indicator-routing.module';
import { StatusIndicatorComponent } from './status-indicator.component';

@NgModule({
  declarations: [StatusIndicatorComponent],
  imports: [
    CommonModule,
    StatusIndicatorRoutingModule,
    SkyHelpInlineModule,
    SkyStatusIndicatorModule,
  ],
})
export class StatusIndicatorModule {
  public static routes = StatusIndicatorRoutingModule.routes;
}
