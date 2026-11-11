import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyCode } from '@skyux/code';
import { SkyIdModule } from '@skyux/core';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { DatepickerRoutingModule } from './datepicker-routing.module';
import { DatepickerComponent } from './datepicker.component';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    DatepickerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyCode,
    SkyDatepickerModule,
    SkyIdModule,
    SkyInputBoxModule,
    RouterModule,
  ],
})
export class DatepickerModule {
  public static routes = DatepickerRoutingModule.routes;
}
