import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyLabelModule } from '@skyux/indicators';

import { LabelDemoRoutingModule } from './label-demo-routing.module';
import { LabelDemoComponent } from './label-demo.component';

@NgModule({
  imports: [CommonModule, SkyLabelModule, LabelDemoRoutingModule],
  exports: [LabelDemoComponent],
  declarations: [LabelDemoComponent],
})
export class LabelDemoModule {
  public static routes = LabelDemoRoutingModule.routes;
}
