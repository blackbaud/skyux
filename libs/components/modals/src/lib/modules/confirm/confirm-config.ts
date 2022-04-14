import { SkyConfirmButtonConfig } from './confirm-button-config';
import { SkyConfirmType } from './confirm-type';

export interface SkyConfirmConfig {
  /**
   * Specifies the message to display in bold at the top of the dialog.
   * @required
   */
  message: string;
  /**
   * Specifies secondary text to display under the primary message.
   */
  body?: string;
  /**
   * Specifies a list of buttons to display when the `type` property is set to `SkyConfirmType.Custom`.
   */
  buttons?: SkyConfirmButtonConfig[];
  /**
   * Indicates whether to preserve whitespace and new lines inside the dialog.
   * @default false
   */
  preserveWhiteSpace?: boolean;
  /**
   * Specifies a preset button configuration for the dialog.
   */
  type?: SkyConfirmType;
}
