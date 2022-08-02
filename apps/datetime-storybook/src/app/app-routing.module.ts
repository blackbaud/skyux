import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DatePipeVisualComponent } from './visual/date-pipe/date-pipe-visual.component';
import { DateRangePickerVisualComponent } from './visual/date-range-picker/date-range-picker-visual.component';
import { DatepickerVisualComponent } from './visual/datepicker/datepicker-visual.component';
import { FuzzyDatePipeVisualComponent } from './visual/fuzzy-date-pipe/fuzzy-date-pipe-visual.component';
import { FuzzyDatepickerVisualComponent } from './visual/fuzzy-datepicker/fuzzy-datepicker-visual.component';
import { TimepickerVisualComponent } from './visual/timepicker/timepicker-visual.component';
import { VisualComponent } from './visual/visual.component';

const routes: Routes = [
  {
    path: '',
    component: VisualComponent,
  },
  {
    path: 'visual/datepicker',
    component: DatepickerVisualComponent,
  },
  {
    path: 'visual/date-range-picker',
    component: DateRangePickerVisualComponent,
  },
  {
    path: 'visual/fuzzy-datepicker',
    component: FuzzyDatepickerVisualComponent,
  },
  {
    path: 'visual/timepicker',
    component: TimepickerVisualComponent,
  },
  {
    path: 'visual/date-pipe',
    component: DatePipeVisualComponent,
  },
  {
    path: 'visual/fuzzy-date-pipe',
    component: FuzzyDatePipeVisualComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
