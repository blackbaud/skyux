import { NgModule } from '@angular/core';
import { SkyViewkeeperModule } from '@skyux/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';

import { ToolbarRoutingModule } from './toolbar-routing.module';
import { ToolbarComponent } from './toolbar.component';

@NgModule({
  declarations: [ToolbarComponent],
  imports: [
    ToolbarRoutingModule,
    SkyIconModule,
    SkyToolbarModule,
    SkyViewkeeperModule,
  ],
})
export class ToolbarModule {
  public static routes = ToolbarRoutingModule.routes;
}
