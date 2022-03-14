import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { DatepickerRoutingModule } from './datepicker-routing.module';
import { DatepickerComponent } from './datepicker.component';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    DatepickerRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
    RouterModule,
  ],
})
export class DatepickerModule {}
