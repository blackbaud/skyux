import { NgModule } from '@angular/core';

import { SkyDatePipe } from './date.pipe';
import { SkyFuzzyDatePipe } from './fuzzy-date.pipe';

@NgModule({
  imports: [SkyDatePipe, SkyFuzzyDatePipe],
  exports: [SkyDatePipe, SkyFuzzyDatePipe],
})
export class SkyDatePipeModule {}
