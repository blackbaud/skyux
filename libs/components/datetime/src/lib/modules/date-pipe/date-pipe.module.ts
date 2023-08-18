import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SkyDatetimeResourcesModule } from '../shared/sky-datetime-resources.module';

import { SkyDatePipe } from './date.pipe';
import { SkyDateService } from './date.service';
import { SkyFuzzyDatePipe } from './fuzzy-date.pipe';

@NgModule({
  declarations: [SkyDatePipe, SkyFuzzyDatePipe],
  providers: [SkyDatePipe, SkyFuzzyDatePipe, SkyDateService],
  imports: [CommonModule, SkyDatetimeResourcesModule],
  exports: [SkyDatePipe, SkyFuzzyDatePipe],
})
export class SkyDatePipeModule {}
