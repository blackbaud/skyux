import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyDateRangePickerModule } from '@skyux/datetime';
import { SkyCheckboxModule } from '@skyux/forms';
import { SkyModalModule } from '@skyux/modals';
import { SkySectionedFormModule } from '@skyux/tabs';

import { SectionedFormRoutingModule } from './sectioned-form-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SkyCheckboxModule,
    SkyDateRangePickerModule,
    SkyModalModule,
    SkySectionedFormModule,
    SectionedFormRoutingModule,
  ],
})
export class SectionedFormModule {
  public static routes = SectionedFormRoutingModule.routes;
}
