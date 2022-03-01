import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkyInputBoxModule } from '@skyux/forms';
import { RouterModule } from '@angular/router';
import { SkyDatepickerModule } from '@skyux/datetime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatepickerComponent } from './datepicker.component';
import { DatepickerRoutingModule } from './datepicker-routing.module';

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
