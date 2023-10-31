/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-indicators' schematic.
 * To update this file, simply rerun the command.
 */
import { NgModule } from '@angular/core';
import {
  SKY_LIB_RESOURCES_PROVIDERS,
  SkyAppLocaleInfo,
  SkyI18nModule,
  SkyLibResources,
  SkyLibResourcesProvider,
  SkyLibResourcesService,
  getLibStringForLocale,
} from '@skyux/i18n';

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': {
    skyux_alert_close: { message: 'Close the alert' },
    skyux_alert_sr_attention: { message: 'Attention:' },
    skyux_alert_sr_caution: { message: 'Caution:' },
    skyux_alert_sr_completed: { message: 'Completed:' },
    skyux_alert_sr_danger: { message: 'Danger:' },
    skyux_alert_sr_error: { message: 'Error:' },
    skyux_alert_sr_important_info: { message: 'Important information:' },
    skyux_alert_sr_important_warning: { message: 'Important warning:' },
    skyux_alert_sr_success: { message: 'Success:' },
    skyux_alert_sr_warning: { message: 'Warning:' },
    skyux_help_inline_button_title: { message: 'Show help content' },
    skyux_label_sr_attention: { message: 'Attention:' },
    skyux_label_sr_caution: { message: 'Caution:' },
    skyux_label_sr_completed: { message: 'Completed:' },
    skyux_label_sr_danger: { message: 'Danger:' },
    skyux_label_sr_error: { message: 'Error:' },
    skyux_label_sr_important_info: { message: 'Important information:' },
    skyux_label_sr_important_warning: { message: 'Important warning:' },
    skyux_label_sr_success: { message: 'Success:' },
    skyux_label_sr_warning: { message: 'Warning:' },
    skyux_status_indicator_sr_attention: { message: 'Attention:' },
    skyux_status_indicator_sr_caution: { message: 'Caution:' },
    skyux_status_indicator_sr_completed: { message: 'Completed:' },
    skyux_status_indicator_sr_danger: { message: 'Danger:' },
    skyux_status_indicator_sr_error: { message: 'Error:' },
    skyux_status_indicator_sr_important_info: {
      message: 'Important information:',
    },
    skyux_status_indicator_sr_important_warning: {
      message: 'Important warning:',
    },
    skyux_status_indicator_sr_success: { message: 'Success:' },
    skyux_status_indicator_sr_warning: { message: 'Warning:' },
    skyux_tokens_dismiss_button_default_label: { message: 'Remove ' },
    skyux_tokens_token_dismissed: { message: '{0} removed' },
    skyux_wait_aria_alt_text: { message: 'Loading.' },
    skyux_wait_blocking_aria_alt_text: { message: 'Loading. Please wait.' },
    skyux_wait_page_aria_alt_text: { message: 'Page loading.' },
    skyux_wait_page_blocking_aria_alt_text: {
      message: 'Page loading. Please wait.',
    },
    skyux_wait_screen_reader_completed_text: { message: 'Loading complete.' },
    skyux_wait_page_screen_reader_completed_text: {
      message: 'Page loading complete.',
    },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyIndicatorsResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyIndicatorsResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyIndicatorsResourcesModule {}
