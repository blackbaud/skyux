import { ChangeDetectorRef, Component, inject, input } from '@angular/core';

import { SkyPercentPipeModule } from '../percent-pipe.module';
import { SkyPercentPipe } from '../percent.pipe';

@Component({
  selector: 'sky-percent-pipe-test',
  templateUrl: './percent-pipe.component.fixture.html',
  imports: [SkyPercentPipeModule],
  providers: [SkyPercentPipe],
})
export class PercentPipeTestComponent {
  public format = input<string | undefined>(undefined);

  public locale = input<string | undefined>(undefined);

  // Set to 'unknown' since our tests check multiple value types.
  public numberValue = input<unknown>(0.8675309);

  readonly #changeDetectorRef = inject(ChangeDetectorRef);
  readonly #percentPipe = inject(SkyPercentPipe);

  public markForCheck(): void {
    this.#changeDetectorRef.markForCheck();
  }

  public getDatePipeResult(
    value: string,
    format: string,
    locale: string,
  ): string {
    return this.#percentPipe.transform(value, format, locale);
  }
}
