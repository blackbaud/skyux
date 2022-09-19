import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

import { BoxRoutingModule } from './box-routing.module';
import { BoxComponent } from './box.component';

@NgModule({
  imports: [
    BoxRoutingModule,
    CommonModule,
    FormsModule,
    SkyHelpInlineModule,
    SkyBoxModule,
    SkyDropdownModule,
  ],
  declarations: [BoxComponent],
  exports: [BoxComponent],
})
export class BoxModule {
  public static routes = BoxRoutingModule.routes;
}
