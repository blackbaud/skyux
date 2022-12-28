import { SkyInlineFormButtonConfig } from './inline-form-button-config';
import { SkyInlineFormButtonLayout } from './inline-form-button-layout';

/**
 * Configuration options for the buttons to display with the inline form.
 */
export interface SkyInlineFormConfig {
  /**
   * The buttons to display with the inline form. The valid options are `Custom`
   * for custom buttons, `DoneCancel` for Done and Cancel buttons, `DoneDeleteCancel` for Done,
   * Delete, and Cancel buttons, `SaveCancel` for Save and Cancel buttons, and `SaveDeleteCancel`
   * for Save, Delete, and Cancel buttons.
   * @required
   */
  buttonLayout: SkyInlineFormButtonLayout;
  /**
   * Configuration options for the inline form's buttons when `buttonLayout` is set to `Custom`.
   */
  buttons?: SkyInlineFormButtonConfig[];
}
