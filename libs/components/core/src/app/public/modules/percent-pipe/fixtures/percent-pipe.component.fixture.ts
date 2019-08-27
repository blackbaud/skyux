import {
  Component
} from '@angular/core';

import {
  SkyPercentPipe
} from '../percent.pipe';

@Component({
  selector: 'percent-pipe-test',
  templateUrl: './percent-pipe.component.fixture.html'
})
export class PercentPipeTestComponent {
  public numberValue: any = 0.8675309;
  public format: string;
  public locale: string;

  constructor(
    private percentPipe: SkyPercentPipe
  ) { }

  public getDatePipeResult(
    value: string,
    format: string,
    locale: string
  ): string {
    return this.percentPipe.transform(value, format, locale);
  }
}
