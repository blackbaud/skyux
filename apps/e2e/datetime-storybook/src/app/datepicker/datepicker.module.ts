import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatepickerComponent } from './datepicker.component';

const routes: Routes = [{ path: '', component: DatepickerComponent }];
@NgModule({
  declarations: [DatepickerComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [DatepickerComponent],
})
export class DatepickerModule {}
