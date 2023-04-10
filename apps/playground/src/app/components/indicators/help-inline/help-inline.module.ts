import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyPopoverModule } from '@skyux/popovers';

import { HelpInlineRoutingModule } from './help-inline-routing.module';
import { HelpInlineComponent } from './help-inline.component';

@NgModule({
  declarations: [HelpInlineComponent],
  imports: [
    CommonModule,
    HelpInlineRoutingModule,
    SkyHelpInlineModule,
    SkyPopoverModule,
  ],
})
export class HelpInlineModule {
  public static routes = HelpInlineRoutingModule.routes;
}
