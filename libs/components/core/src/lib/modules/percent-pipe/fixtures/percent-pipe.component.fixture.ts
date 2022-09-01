import { Component } from '@angular/core';

import { SkyPercentPipe } from '../percent.pipe';

@Component({
  selector: 'sky-percent-pipe-test',
  templateUrl: './percent-pipe.component.fixture.html',
})
export class PercentPipeTestComponent {
  public format: string | undefined;

  public locale: string | undefined;

  // Set to 'unknown' since our tests check multiple value types.
  public numberValue: unknown = 0.8675309;

  constructor(private percentPipe: SkyPercentPipe) {}

  public getDatePipeResult(
    value: string,
    format: string,
    locale: string
  ): string {
    return this.percentPipe.transform(value, format, locale);
  }
}
