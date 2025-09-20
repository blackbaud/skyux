import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import { SkyBoxModule } from '@skyux/layout';
import { SkyDropdownModule } from '@skyux/popovers';

import { BoxRoutingModule } from './box-routing.module';
import { BoxComponent } from './box.component';

@NgModule({
  imports: [
    BoxRoutingModule,
    FormsModule,
    SkyHelpInlineModule,
    SkyBoxModule,
    SkyCheckboxModule,
    SkyDropdownModule,
  ],
  declarations: [BoxComponent],
  exports: [BoxComponent],
})
export class BoxModule {
  public static routes = BoxRoutingModule.routes;
}
