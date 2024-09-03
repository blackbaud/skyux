import { NgModule } from '@angular/core';
import { SkyLabelModule } from '@skyux/indicators';

import { LabelRoutingModule } from './label-routing.module';
import { LabelDemoComponent } from './label.component';

@NgModule({
  declarations: [LabelDemoComponent],
  imports: [LabelRoutingModule, SkyLabelModule],
})
export class LabelModule {
  public static routes = LabelRoutingModule.routes;
}
