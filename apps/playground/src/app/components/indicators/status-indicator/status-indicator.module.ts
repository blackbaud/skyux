import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyStatusIndicatorModule } from '@skyux/indicators';

import { StatusIndicatorRoutingModule } from './status-indicator-routing.module';
import { StatusIndicatorComponent } from './status-indicator.component';

@NgModule({
  declarations: [StatusIndicatorComponent],
  imports: [
    StatusIndicatorRoutingModule,
    SkyHelpInlineModule,
    SkyStatusIndicatorModule,
  ],
})
export class StatusIndicatorModule {
  public static routes = StatusIndicatorRoutingModule.routes;
}
