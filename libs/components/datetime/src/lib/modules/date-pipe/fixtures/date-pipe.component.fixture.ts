import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { SkyDatePipeModule } from '../date-pipe.module';
import { SkyDatePipe } from '../date.pipe';

@Component({
  selector: 'sky-date-pipe-test',
  templateUrl: './date-pipe.component.fixture.html',
  imports: [SkyDatePipeModule],
  providers: [SkyDatePipe],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DatePipeTestComponent {
  public readonly dateValue = input<any>(new Date(2000, 0, 1));
  public readonly format = input<string | undefined>(undefined);
  public readonly locale = input<string | undefined>(undefined);

  readonly #datePipe = inject(SkyDatePipe);

  public getDatePipeResult(
    value: Date,
    format: string,
    locale: string,
  ): string {
    return this.#datePipe.transform(value, format, locale);
  }
}
