/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-lookup' schematic.
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
    skyux_autocomplete_add: { message: 'New' },
    skyux_autocomplete_no_results: { message: 'No matches found' },
    skyux_autocomplete_show_all: { message: 'Show all' },
    skyux_autocomplete_show_all_count: { message: 'Show all {0}' },
    skyux_autocomplete_show_matches_count: { message: 'Show matches ({0})' },
    skyux_country_field_search_placeholder: { message: 'Search for a country' },
    skyux_lookup_search_button_show_more: {
      message: 'Show all search results',
    },
    skyux_lookup_show_more_add: { message: 'New' },
    skyux_lookup_show_more_select_all_button_aria_label: {
      message: 'Select all {0}',
    },
    skyux_lookup_show_more_select_all_button_title: { message: 'Select all' },
    skyux_lookup_show_more_clear_all_button_aria_label: {
      message: 'Clear all {0}',
    },
    skyux_lookup_show_more_clear_all_button_title: { message: 'Clear all' },
    skyux_lookup_show_more_show_selected_option_aria_label: {
      message: 'Show only selected {0}',
    },
    skyux_lookup_show_more_show_selected_option_title: {
      message: 'Show only selected items',
    },
    skyux_lookup_show_more_cancel: { message: 'Cancel' },
    skyux_lookup_show_more_modal_title: { message: 'Select {0}' },
    skyux_lookup_show_more_modal_title_single: { message: 'Select an option' },
    skyux_lookup_show_more_modal_title_multiple: { message: 'Select options' },
    skyux_lookup_show_more_no_results: { message: 'No matches found' },
    skyux_lookup_show_more_select: { message: 'Select' },
    skyux_lookup_show_more_select_context: { message: 'Select {0}' },
    skyux_lookup_tokens_summary: { message: '{0} items selected' },
    skyux_search_aria_label_descriptor: { message: 'Search {0}' },
    skyux_search_dismiss: { message: 'Dismiss search' },
    skyux_search_label: { message: 'Search items' },
    skyux_search_open: { message: 'Open search' },
    skyux_search_placeholder: { message: 'Find in this list' },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyLookupResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyLookupResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyLookupResourcesModule {}
