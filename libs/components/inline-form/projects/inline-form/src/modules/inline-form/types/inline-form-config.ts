import {
  SkyInlineFormButtonConfig
} from './inline-form-button-config';

import {
  SkyInlineFormButtonLayout
} from './inline-form-button-layout';

/**
 * Specifies configuration options for the buttons to display with the inline form.
 */
export interface SkyInlineFormConfig {
  /**
   * Specifies the buttons to display with the inline form. The valid options are `Custom`
   * for custom buttons, `DoneCancel` for Done and Cancel buttons, `DoneDeleteCancel` for Done,
   * Delete, and Cancel buttons, `SaveCancel` for Save and Cancel buttons, and `SaveDeleteCancel`
   * for Save, Delete, and Cancel buttons.
   * @required
   */
  buttonLayout: SkyInlineFormButtonLayout;
  /**
   * Specifies configuration options for the inline form's buttons.
   */
  buttons?: SkyInlineFormButtonConfig[];
}
