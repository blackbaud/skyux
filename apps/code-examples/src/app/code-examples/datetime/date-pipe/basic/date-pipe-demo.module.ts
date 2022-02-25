import { CommonModule } from '@angular/common';

import { NgModule } from '@angular/core';

import { SkyDatePipeModule } from '@skyux/datetime';

import { DatePipeDemoComponent } from './date-pipe-demo.component';

@NgModule({
  imports: [CommonModule, SkyDatePipeModule],
  exports: [DatePipeDemoComponent],
  declarations: [DatePipeDemoComponent],
})
export class DatePipeDemoModule {}
