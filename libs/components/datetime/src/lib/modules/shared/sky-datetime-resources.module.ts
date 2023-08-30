/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-datetime' schematic.
 * To update this file, simply rerun the command.
 */
import { NgModule } from '@angular/core';
import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  getLibStringForLocale,
} from '@skyux/i18n';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-AU': {
    skyux_date_range_picker_format_label_last_fiscal_year: {
      message: 'Last financial year',
    },
    skyux_date_range_picker_format_label_this_fiscal_year: {
      message: 'This financial year',
    },
    skyux_date_range_picker_format_label_next_fiscal_year: {
      message: 'Next financial year',
    },
  },
  'EN-GB': {
    skyux_date_range_picker_format_label_last_fiscal_year: {
      message: 'Last financial year',
    },
    skyux_date_range_picker_format_label_this_fiscal_year: {
      message: 'This financial year',
    },
    skyux_date_range_picker_format_label_next_fiscal_year: {
      message: 'Next financial year',
    },
  },
  'EN-NZ': {
    skyux_date_range_picker_format_label_last_fiscal_year: {
      message: 'Last financial year',
    },
    skyux_date_range_picker_format_label_this_fiscal_year: {
      message: 'This financial year',
    },
    skyux_date_range_picker_format_label_next_fiscal_year: {
      message: 'Next financial year',
    },
  },
  'EN-US': {
    skyux_datepicker_trigger_button_label: { message: 'Select date' },
    skyux_timepicker_button_label: { message: 'Choose time' },
    skyux_timepicker_close: { message: 'Done' },
    skyux_date_range_picker_default_label: { message: 'Select a date range' },
    skyux_date_range_picker_format_label_specific_range: {
      message: 'Specific range',
    },
    skyux_date_range_picker_format_label_before: { message: 'Before' },
    skyux_date_range_picker_format_label_after: { message: 'After' },
    skyux_date_range_picker_format_label_any_time: { message: 'At any time' },
    skyux_date_range_picker_format_label_yesterday: { message: 'Yesterday' },
    skyux_date_range_picker_format_label_today: { message: 'Today' },
    skyux_date_range_picker_format_label_tomorrow: { message: 'Tomorrow' },
    skyux_date_range_picker_format_label_last_week: { message: 'Last week' },
    skyux_date_range_picker_format_label_this_week: { message: 'This week' },
    skyux_date_range_picker_format_label_next_week: { message: 'Next week' },
    skyux_date_range_picker_format_label_last_month: { message: 'Last month' },
    skyux_date_range_picker_format_label_this_month: { message: 'This month' },
    skyux_date_range_picker_format_label_next_month: { message: 'Next month' },
    skyux_date_range_picker_format_label_last_quarter: {
      message: 'Last quarter',
    },
    skyux_date_range_picker_format_label_this_quarter: {
      message: 'This quarter',
    },
    skyux_date_range_picker_format_label_next_quarter: {
      message: 'Next quarter',
    },
    skyux_date_range_picker_format_label_last_calendar_year: {
      message: 'Last calendar year',
    },
    skyux_date_range_picker_format_label_this_calendar_year: {
      message: 'This calendar year',
    },
    skyux_date_range_picker_format_label_next_calendar_year: {
      message: 'Next calendar year',
    },
    skyux_date_range_picker_format_label_last_fiscal_year: {
      message: 'Last fiscal year',
    },
    skyux_date_range_picker_format_label_this_fiscal_year: {
      message: 'This fiscal year',
    },
    skyux_date_range_picker_format_label_next_fiscal_year: {
      message: 'Next fiscal year',
    },
    skyux_date_range_picker_start_date_label: { message: 'From date' },
    skyux_date_range_picker_end_date_label: { message: 'To date' },
    skyux_date_range_picker_before_date_label: { message: 'Before date' },
    skyux_date_range_picker_after_date_label: { message: 'After date' },
  },
};

export class SkyDatetimeResourcesProvider implements SkyLibResourcesProvider {
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string
  ): string | undefined {
    return getLibStringForLocale(RESOURCES, localeInfo.locale, name);
  }
}

/**
 * Import into any component library module that needs to use resource strings.
 */
@NgModule({
  exports: [SkyI18nModule],
  providers: [
    {
      provide: SKY_LIB_RESOURCES_PROVIDERS,
      useClass: SkyDatetimeResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyDatetimeResourcesModule {}
