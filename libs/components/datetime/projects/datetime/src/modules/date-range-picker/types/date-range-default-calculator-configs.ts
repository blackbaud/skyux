import { SkyDateRangeCalculatorId } from './date-range-calculator-id';

import { SkyDateRangeCalculatorType } from './date-range-calculator-type';

import { SkyDateRangeDefaultCalculatorConfig } from './date-range-default-calculator-config';

import { SkyDateRangeRelativeValue } from './date-range-relative-value';

export const SKY_DEFAULT_CALCULATOR_CONFIGS: SkyDateRangeDefaultCalculatorConfig[] =
  [
    {
      calculatorId: SkyDateRangeCalculatorId.AnyTime,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_any_time',
      getValue: (startDate, endDate) => ({ startDate, endDate }),
    },

    {
      calculatorId: SkyDateRangeCalculatorId.Before,
      type: SkyDateRangeCalculatorType.Before,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_before',
      getValue: (startDate, endDate) => ({ startDate, endDate }),
    },

    {
      calculatorId: SkyDateRangeCalculatorId.After,
      type: SkyDateRangeCalculatorType.After,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_after',
      getValue: (startDate, endDate) => ({ startDate, endDate }),
    },

    {
      calculatorId: SkyDateRangeCalculatorId.SpecificRange,
      type: SkyDateRangeCalculatorType.Range,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_specific_range',
      getValue: (startDate, endDate) => ({ startDate, endDate }),
      validate: (value) => {
        if (
          value.startDate &&
          value.endDate &&
          value.startDate > value.endDate
        ) {
          return {
            endDateBeforeStartDate: true,
          };
        }
      },
    },

    {
      calculatorId: SkyDateRangeCalculatorId.LastFiscalYear,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_last_fiscal_year',
      getValue: () => SkyDateRangeRelativeValue.lastFiscalYear,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.LastMonth,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_last_month',
      getValue: () => SkyDateRangeRelativeValue.lastMonth,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.LastQuarter,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_last_quarter',
      getValue: () => SkyDateRangeRelativeValue.lastQuarter,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.LastWeek,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_last_week',
      getValue: () => SkyDateRangeRelativeValue.lastWeek,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.LastCalendarYear,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_last_calendar_year',
      getValue: () => SkyDateRangeRelativeValue.lastCalendarYear,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.NextFiscalYear,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_next_fiscal_year',
      getValue: () => SkyDateRangeRelativeValue.nextFiscalYear,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.NextMonth,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_next_month',
      getValue: () => SkyDateRangeRelativeValue.nextMonth,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.NextQuarter,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_next_quarter',
      getValue: () => SkyDateRangeRelativeValue.nextQuarter,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.NextWeek,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_next_week',
      getValue: () => SkyDateRangeRelativeValue.nextWeek,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.NextCalendarYear,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_next_calendar_year',
      getValue: () => SkyDateRangeRelativeValue.nextCalendarYear,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.ThisFiscalYear,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_this_fiscal_year',
      getValue: () => SkyDateRangeRelativeValue.thisFiscalYear,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.ThisMonth,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_this_month',
      getValue: () => SkyDateRangeRelativeValue.thisMonth,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.ThisQuarter,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_this_quarter',
      getValue: () => SkyDateRangeRelativeValue.thisQuarter,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.ThisWeek,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_this_week',
      getValue: () => SkyDateRangeRelativeValue.thisWeek,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.ThisCalendarYear,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_this_calendar_year',
      getValue: () => SkyDateRangeRelativeValue.thisCalendarYear,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.Today,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey: 'skyux_date_range_picker_format_label_today',
      getValue: () => SkyDateRangeRelativeValue.today,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.Tomorrow,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_tomorrow',
      getValue: () => SkyDateRangeRelativeValue.tomorrow,
    },

    {
      calculatorId: SkyDateRangeCalculatorId.Yesterday,
      type: SkyDateRangeCalculatorType.Relative,
      shortDescriptionResourceKey:
        'skyux_date_range_picker_format_label_yesterday',
      getValue: () => SkyDateRangeRelativeValue.yesterday,
    },
  ];
