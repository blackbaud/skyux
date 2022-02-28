import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyDatePipeModule } from '../date-pipe.module';

import { DatePipeTestComponent } from './date-pipe.component.fixture';

@NgModule({
  declarations: [DatePipeTestComponent],
  exports: [DatePipeTestComponent],
  imports: [CommonModule, SkyDatePipeModule],
})
export class DatePipeTestModule {}
