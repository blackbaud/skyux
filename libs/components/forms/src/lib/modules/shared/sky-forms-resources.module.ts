/* istanbul ignore file */

/**
 * NOTICE: DO NOT MODIFY THIS FILE!
 * The contents of this file were automatically generated by
 * the 'ng generate @skyux/i18n:lib-resources-module lib/modules/shared/sky-forms' schematic.
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

const RESOURCES: Record<string, SkyLibResources> = {
  'EN-US': {
    skyux_character_count_message: { message: '{0} characters out of {1}' },
    skyux_character_count_over_limit: {
      message: 'You are over the character limit.',
    },
    skyux_checkbox_group_required: { message: 'Required' },
    skyux_form_error_character_count: {
      message: 'Limit {0} to {1} character(s).',
    },
    skyux_form_error_date: { message: 'Select or enter a valid date.' },
    skyux_form_error_date_max: {
      message: 'Select or enter a date before the max date.',
    },
    skyux_form_error_date_min: {
      message: 'Select or enter a date after the min date.',
    },
    skyux_form_error_fuzzy_date_future_disabled: {
      message: 'Future dates are disabled, select or enter a date in the past.',
    },
    skyux_form_error_fuzzy_date_invalid: {
      message: 'Select or enter a valid date.',
    },
    skyux_form_error_fuzzy_date_max_date: {
      message: 'Select or enter a date before the max date.',
    },
    skyux_form_error_fuzzy_date_min_date: {
      message: 'Select or enter a date after the min date.',
    },
    skyux_form_error_fuzzy_date_year_required: { message: 'Year is required.' },
    skyux_form_error_email: {
      message: 'Enter an email address with a valid format.',
    },
    skyux_form_error_maxlength: { message: 'Limit {0} to {1} character(s).' },
    skyux_form_error_minlength: {
      message: '{0} must be at least {1} character(s).',
    },
    skyux_form_error_phone: {
      message:
        'Enter a phone number matching the format for the selected country.',
    },
    skyux_form_error_required: { message: '{0} is required.' },
    skyux_form_error_time: { message: 'Select or enter a valid time.' },
    skyux_form_error_url: { message: 'Enter a URL with a valid format.' },
    skyux_file_attachment_button_label_choose_file: { message: 'Attach file' },
    skyux_file_attachment_button_label_choose_file_label: {
      message: 'Attach file for',
    },
    skyux_file_attachment_button_label_replace_file: {
      message: 'Replace file',
    },
    skyux_file_attachment_button_label_replace_file_label: {
      message: 'Replace file {0} for',
    },
    skyux_file_attachment_file_item_delete: { message: 'Delete {0}' },
    skyux_file_attachment_file_item_remove: { message: 'Remove file {0} for' },
    skyux_file_attachment_file_size_b_plural: { message: '{0} bytes' },
    skyux_file_attachment_file_size_b_singular: { message: '{0} byte' },
    skyux_file_attachment_file_size_gb: { message: '{0} GB' },
    skyux_file_attachment_file_size_kb: { message: '{0} KB' },
    skyux_file_attachment_file_size_mb: { message: '{0} MB' },
    skyux_file_attachment_file_upload_drag_file_here: {
      message: 'Drag a file here',
    },
    skyux_file_attachment_file_upload_drag_or_click: {
      message: 'Drag a file here or click to browse',
    },
    skyux_file_attachment_file_upload_drop_files_here: {
      message: 'Drop files here',
    },
    skyux_file_attachment_file_upload_file_added: { message: '{0} added.' },
    skyux_file_attachment_file_upload_file_replaced: {
      message: '{0} removed. {1} added.',
    },
    skyux_file_attachment_file_upload_file_removed: { message: '{0} removed.' },
    skyux_file_attachment_file_upload_image_preview_alt_text: {
      message: 'Image preview',
    },
    skyux_file_attachment_file_upload_invalid_file: {
      message: 'This file type is invalid',
    },
    skyux_file_attachment_file_upload_link_label: { message: 'Link to a file' },
    skyux_file_attachment_file_upload_link_placeholder: {
      message: 'Start with http:// or https://',
    },
    skyux_file_attachment_file_upload_or_click_to_browse: {
      message: 'or click to browse',
    },
    skyux_file_attachment_file_upload_link_done: { message: 'Done' },
    skyux_file_attachment_file_upload_link_added: {
      message: 'Link to {0} added.',
    },
    skyux_file_attachment_file_upload_link_removed: {
      message: 'Link to {0} removed.',
    },
    skyux_file_attachment_file_type_error_label_text: {
      message: 'Upload one of these file types: {0}.',
    },
    skyux_file_attachment_file_type_error_label_text_with_name: {
      message: '{0}: Upload one of these file types: {1}.',
    },
    skyux_file_attachment_max_file_size_error_label_text: {
      message: 'Upload a file under {0}.',
    },
    skyux_file_attachment_max_file_size_error_label_text_with_name: {
      message: '{0}: Upload a file under {1}.',
    },
    skyux_file_attachment_min_file_size_error_label_text: {
      message: 'Upload a file over {0}.',
    },
    skyux_file_attachment_min_file_size_error_label_text_with_name: {
      message: '{0}: Upload a file over {1}.',
    },
    skyux_file_attachment_label_no_file_chosen: { message: 'No file chosen.' },
    skyux_file_attachment_required: { message: 'Required' },
    skyux_input_box_help_inline_aria_label: {
      message: 'Show help content for {0}',
    },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyFormsResourcesProvider implements SkyLibResourcesProvider {
  public getString(
    localeInfo: SkyAppLocaleInfo,
    name: string,
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
      useClass: SkyFormsResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyFormsResourcesModule {}
