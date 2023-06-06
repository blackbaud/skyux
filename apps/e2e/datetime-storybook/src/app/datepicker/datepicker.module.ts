import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { DatepickerComponent } from './datepicker.component';

const routes: Routes = [{ path: '', component: DatepickerComponent }];
@NgModule({
  declarations: [DatepickerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SkyDatepickerModule,
    SkyIdModule,
    SkyInputBoxModule,
    RouterModule.forChild(routes),
  ],
  exports: [DatepickerComponent],
})
export class DatepickerModule {}
