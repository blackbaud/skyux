import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import { map } from 'rxjs/operators';

import { SkyChartMeasureScaleType } from '../shared/measure-scale-type';
import { SkyChartValueFormat } from '../shared/value-format';
import { createSkyChartValueFormatter } from '../shared/value-formatter';

/**
 * Defines the measure axis of a chart, which scales the plotted series and
 * formats their values in axis labels, tooltips, and the data table.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-axis-measure',
  template: '',
})
export class SkyChartAxisMeasure {
  readonly #localeProvider = inject(SkyAppLocaleProvider);
  readonly #logSvc = inject(SkyLogService);

  readonly #locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((info) => info.locale)),
    { initialValue: this.#localeProvider.defaultLocale },
  );

  /**
   * The ISO 4217 currency code (for example, `USD`) used when `format` is
   * `currency`.
   */
  public readonly currencyCode = input<string>();

  /**
   * The number of decimal places to display. When unset, the format's
   * locale-aware default is used (for example, two places for most
   * currencies).
   */
  public readonly digits = input<number | undefined, unknown>(undefined, {
    transform: (value) => {
      if (value === undefined || value === null) {
        return undefined;
      }

      const digits = numberAttribute(value);

      return Number.isNaN(digits) ? undefined : digits;
    },
  });

  /**
   * How to format the axis values in axis labels, tooltips, and the data table.
   * The `percent` format expects fractional values, so `0.25` displays as
   * `25%`.
   * @default 'number'
   */
  public readonly format = input<SkyChartValueFormat>('number');

  /**
   * Whether to hide the axis label.
   */
  public readonly labelHidden = input(false, { transform: booleanAttribute });

  /**
   * The text of the axis label.
   */
  public readonly labelText = input.required<string>();

  /**
   * The scale type for the measure axis.
   * @default 'linear'
   */
  public readonly scaleType = input<SkyChartMeasureScaleType>('linear');

  /**
   * Formats a numeric value according to this axis's `format`, `currencyCode`,
   * and the current locale.
   * @internal
   */
  public readonly formatValue = computed<(value: number) => string>(() =>
    createSkyChartValueFormatter({
      format: this.format(),
      currencyCode: this.currencyCode(),
      digits: this.digits(),
      locale: this.#locale(),
    }),
  );

  constructor() {
    effect(() => {
      if (this.format() === 'currency' && !this.currencyCode()) {
        this.#logSvc.warn(
          'The `sky-chart-axis-measure` "currency" format requires a ' +
            '`currencyCode`. Values are formatted as plain numbers until one ' +
            'is provided.',
        );
      }
    });
  }
}
