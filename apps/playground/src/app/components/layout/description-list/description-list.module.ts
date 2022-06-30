import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/indicators';
import { SkyDescriptionListModule } from '@skyux/layout';

import { DescriptionListRoutingModule } from './description-list-routing.module';
import { DescriptionListComponent } from './description-list.component';

@NgModule({
  declarations: [DescriptionListComponent],
  imports: [
    CommonModule,
    DescriptionListRoutingModule,
    SkyDescriptionListModule,
    SkyHelpInlineModule,
  ],
})
export class DescriptionListModule {
  public static routes = DescriptionListRoutingModule.routes;
}
