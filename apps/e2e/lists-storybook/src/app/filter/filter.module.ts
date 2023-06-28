import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SkyDateRangePickerModule } from '@skyux/datetime';
import { SkyInputBoxModule } from '@skyux/forms';
import { SkyFilterModule } from '@skyux/lists';

import { FilterComponent } from './filter.component';

const routes: Routes = [{ path: '', component: FilterComponent }];
@NgModule({
  declarations: [FilterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SkyDateRangePickerModule,
    SkyFilterModule,
    SkyInputBoxModule,
  ],
  exports: [FilterComponent],
})
export class FilterModule {}
