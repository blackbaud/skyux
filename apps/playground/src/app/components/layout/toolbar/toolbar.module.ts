import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyRadioModule } from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import { SkySearchModule } from '@skyux/lookup';

import { ToolbarRoutingModule } from './toolbar-routing.module';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    ToolbarRoutingModule,
    SkyIconModule,
    SkyRadioModule,
    SkySearchModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
    FormsModule,
  ],
})
export class ToolbarModule {
  public static routes = ToolbarRoutingModule.routes;
}
