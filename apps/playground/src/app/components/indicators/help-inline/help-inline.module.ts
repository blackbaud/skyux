import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';

import { HelpInlineRoutingModule } from './help-inline-routing.module';
import { HelpInlineComponent } from './help-inline.component';

@NgModule({
  declarations: [HelpInlineComponent],
  imports: [CommonModule, HelpInlineRoutingModule, SkyHelpInlineModule],
})
export class HelpInlineModule {
  public static routes = HelpInlineRoutingModule.routes;
}
