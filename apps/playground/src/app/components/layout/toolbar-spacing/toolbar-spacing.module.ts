import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SkyFilterBarModule } from '@skyux/filter-bar';
import { SkyIconModule } from '@skyux/icon';
import { SkyBoxModule, SkyToolbarModule } from '@skyux/layout';
import { SkyListSummaryModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import { SkyTabsModule } from '@skyux/tabs';

import { ToolbarSpacingRoutingModule } from './toolbar-spacing-routing.module';
import { ToolbarSpacingComponent } from './toolbar-spacing.component';

@NgModule({
  declarations: [ToolbarSpacingComponent],
  imports: [
    FormsModule,
    RouterLink,
    SkyBoxModule,
    SkyFilterBarModule,
    SkyIconModule,
    SkyListSummaryModule,
    SkySearchModule,
    SkyTabsModule,
    SkyToolbarModule,
    ToolbarSpacingRoutingModule,
  ],
})
export class ToolbarSpacingModule {
  public static routes = ToolbarSpacingRoutingModule.routes;
}
