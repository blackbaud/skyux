import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { SkyIdModule } from '@skyux/core';
import { SkyTimepickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';

import { TimepickerComponent } from './timepicker.component';

const routes: Routes = [{ path: '', component: TimepickerComponent }];
@NgModule({
  declarations: [TimepickerComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    SkyTimepickerModule,
    SkyIdModule,
    SkyInputBoxModule,
  ],
  exports: [TimepickerComponent],
})
export class TimepickerModule {}
