import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/indicators';
import { SkyTextExpandRepeaterModule } from '@skyux/layout';

import { TextExpandRepeaterRoutingModule } from './text-expand-repeater-routing.module';
import { TextExpandRepeaterComponent } from './text-expand-repeater.component';

@NgModule({
  declarations: [TextExpandRepeaterComponent],
  imports: [
    CommonModule,
    TextExpandRepeaterRoutingModule,
    SkyIconModule,
    SkyTextExpandRepeaterModule,
    SkyViewkeeperModule,
  ],
})
export class TextExpandRepeaterModule {
  public static routes = TextExpandRepeaterRoutingModule.routes;
}
