import { Component } from '@angular/core';

import { SkyPercentPipe } from '../percent.pipe';

@Component({
  selector: 'sky-percent-pipe-test',
  templateUrl: './percent-pipe.component.fixture.html',
  standalone: false,
})
export class PercentPipeTestComponent {
  public format: string | undefined;

  public locale: string | undefined;

  // Set to 'unknown' since our tests check multiple value types.
  public numberValue: unknown = 0.8675309;

  #percentPipe: SkyPercentPipe;

  constructor(percentPipe: SkyPercentPipe) {
    this.#percentPipe = percentPipe;
  }

  public getDatePipeResult(
    value: string,
    format: string,
    locale: string,
  ): string {
    return this.#percentPipe.transform(value, format, locale);
  }
}
