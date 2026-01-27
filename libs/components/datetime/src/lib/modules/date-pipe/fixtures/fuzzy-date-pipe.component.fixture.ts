import { Component } from '@angular/core';

import { SkyFuzzyDate } from '../../datepicker/fuzzy/fuzzy-date';
import { SkyDatePipeModule } from '../date-pipe.module';
import { SkyFuzzyDatePipe } from '../fuzzy-date.pipe';

@Component({
  selector: 'sky-fuzzy-date-pipe-test',
  templateUrl: './fuzzy-date-pipe.component.fixture.html',
  imports: [SkyDatePipeModule],
  providers: [SkyFuzzyDatePipe],
})
export class FuzzyDatePipeTestComponent {
  public dateValue: SkyFuzzyDate | undefined = {
    year: 1955,
    month: 11,
  };

  public format = 'MMM Y';

  public locale: string | undefined;

  #fuzzyDatePipe: SkyFuzzyDatePipe;

  constructor(fuzzyDatePipe: SkyFuzzyDatePipe) {
    this.#fuzzyDatePipe = fuzzyDatePipe;
  }

  public getFuzzyDatePipeResult(
    value: SkyFuzzyDate,
    format: string,
    locale: string,
  ): string {
    return this.#fuzzyDatePipe.transform(value, format, locale);
  }
}
