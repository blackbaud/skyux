import { NgModule } from '@angular/core';

import { SkyDatePipeModule } from '../date-pipe.module';

import { DatePipeTestComponent } from './date-pipe.component.fixture';

@NgModule({
  exports: [DatePipeTestComponent],
  imports: [SkyDatePipeModule, DatePipeTestComponent],
})
export class DatePipeTestModule {}
