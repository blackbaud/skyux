import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyAppLocaleProvider } from '@skyux/i18n';

import { map } from 'rxjs/operators';

import { SkyChartValueFormat } from '../shared/value-format';
import { createSkyChartValueFormatter } from '../shared/value-formatter';
import { SkyChartValueScaleType } from '../shared/value-scale-type';
import { optionalNumberAttribute } from './optional-number-attribute';

/**
 * Defines the value axis of a chart, which scales the plotted series and
 * formats their values in axis labels, tooltips, and the data table.
 *
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-axis-value',
  template: '',
})
export class SkyChartAxisValue {
  readonly #localeProvider = inject(SkyAppLocaleProvider);

  readonly #locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((info) => info.locale)),
    { initialValue: this.#localeProvider.defaultLocale },
  );

  /**
   * The ISO 4217 currency code used when `format` is `currency`.
   * @default 'USD'
   */
  public readonly currencyCode = input<string>();

  /**
   * The number of decimal places to display. When unset, the format's
   * locale-aware default is used (for example, two places for most
   * currencies).
   */
  public readonly digits = input(undefined, {
    transform: optionalNumberAttribute,
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
   * The highest value to display on the axis. When unset, the axis scales to
   * fit the plotted values.
   */
  public readonly max = input(undefined, {
    transform: optionalNumberAttribute,
  });

  /**
   * The lowest value to display on the axis. When unset, the axis scales to
   * fit the plotted values.
   */
  public readonly min = input(undefined, {
    transform: optionalNumberAttribute,
  });

  /**
   * The scale type for the value axis.
   * @default 'linear'
   */
  public readonly scaleType = input<SkyChartValueScaleType>('linear');

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
}
