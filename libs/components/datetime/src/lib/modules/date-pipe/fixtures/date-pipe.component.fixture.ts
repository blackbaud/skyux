import { Component } from '@angular/core';

import { SkyDatePipe } from '../date.pipe';

@Component({
  selector: 'sky-date-pipe-test',
  templateUrl: './date-pipe.component.fixture.html',
})
export class DatePipeTestComponent {
  public dateValue: any = new Date(2000, 0, 1);
  public format: string | undefined;
  public locale: string | undefined;

  constructor(private datePipe: SkyDatePipe) {}

  public getDatePipeResult(
    value: Date,
    format: string,
    locale: string
  ): string {
    return this.datePipe.transform(value, format, locale);
  }
}
