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
import {
  SkyAppLocaleProvider,
  SkyIntlNumberFormatStyle,
  SkyIntlNumberFormatter,
} from '@skyux/i18n';

import { map } from 'rxjs/operators';

import { SkyChartValueFormat } from './chart-value-format';

/**
 * @preview
 */
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'sky-chart-value-axis',
  template: ``,
})
export class SkyChartValueAxis {
  readonly #localeProvider = inject(SkyAppLocaleProvider);
  readonly #logSvc = inject(SkyLogService);

  readonly #locale = toSignal(
    this.#localeProvider.getLocaleInfo().pipe(map((info) => info.locale)),
    { initialValue: this.#localeProvider.defaultLocale },
  );

  /**
   * A unique identifier that series use to bind to this axis. Required when a
   * chart has more than one value axis.
   */
  public readonly axisId = input<string>();

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
   * Formats a numeric value according to this axis's `format`, `currencyCode`,
   * and the current locale.
   * @internal
   */
  public readonly formatValue = computed<(value: number) => string>(() => {
    const format = this.format();
    const currencyCode = this.currencyCode();
    const digits = this.digits();
    const locale = this.#locale();

    const useCurrency = format === 'currency' && !!currencyCode;

    let style: SkyIntlNumberFormatStyle;

    switch (format) {
      case 'currency':
        style = useCurrency
          ? SkyIntlNumberFormatStyle.Currency
          : SkyIntlNumberFormatStyle.Decimal;
        break;
      case 'percent':
        style = SkyIntlNumberFormatStyle.Percent;
        break;
      default:
        style = SkyIntlNumberFormatStyle.Decimal;
        break;
    }

    return (value: number): string =>
      SkyIntlNumberFormatter.format(value, locale, style, {
        currency: useCurrency ? currencyCode : undefined,
        currencyDisplay: 'symbol',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });
  });

  constructor() {
    effect(() => {
      if (this.format() === 'currency' && !this.currencyCode()) {
        this.#logSvc.warn(
          'The `sky-chart-value-axis` "currency" format requires a ' +
            '`currencyCode`. Values are formatted as plain numbers until one ' +
            'is provided.',
        );
      }
    });
  }
}
