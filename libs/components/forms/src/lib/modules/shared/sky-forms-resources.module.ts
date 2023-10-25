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

const RESOURCES: { [locale: string]: SkyLibResources } = {
  'EN-US': {
    skyux_character_count_message: { message: 'characters out of' },
    skyux_character_count_over_limit: {
      message: 'You are over the character limit.',
    },
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
    skyux_file_attachment_file_item_delete: { message: 'Delete file' },
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
    skyux_file_attachment_file_upload_file_removed: { message: '{0} removed.' },
    skyux_file_attachment_file_upload_image_preview_alt_text: {
      message: 'Image preview',
    },
    skyux_file_attachment_file_upload_invalid_file: {
      message: 'This file type is invalid',
    },
    skyux_file_attachment_file_upload_link_label: { message: 'Link to a file' },
    skyux_file_attachment_file_upload_link_placeholder: {
      message: 'http://www.something.com/file',
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
    skyux_file_attachment_label_no_file_chosen: { message: 'No file chosen.' },
    skyux_input_box_error_character_count: {
      message: 'Limit {0} to {1} character(s).',
    },
    skyux_input_box_error_date: { message: 'Select or enter a valid date.' },
    skyux_input_box_error_email: {
      message: 'Enter an email address with a valid format.',
    },
    skyux_input_box_error_maxlength: {
      message: 'Limit {0} to {1} character(s).',
    },
    skyux_input_box_error_minlength: {
      message: '{0} must be at least {1} character(s).',
    },
    skyux_input_box_error_phone: {
      message:
        'Enter a phone number matching the format for the selected country.',
    },
    skyux_input_box_error_required: { message: '{0} is required.' },
    skyux_input_box_error_time: { message: 'Select or enter a valid time.' },
    skyux_input_box_error_url: { message: 'Enter a URL with a valid format.' },
    skyux_input_box_help_inline_aria_label: {
      message: 'Show help content for {0}',
    },
  },
};

SkyLibResourcesService.addResources(RESOURCES);

export class SkyFormsResourcesProvider implements SkyLibResourcesProvider {
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
      useClass: SkyFormsResourcesProvider,
      multi: true,
    },
  ],
})
export class SkyFormsResourcesModule {}
