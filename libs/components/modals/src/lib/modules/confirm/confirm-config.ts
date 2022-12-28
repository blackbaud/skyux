import { SkyConfirmButtonConfig } from './confirm-button-config';
import { SkyConfirmType } from './confirm-type';

export interface SkyConfirmConfig {
  /**
   * The message to display in bold at the top of the dialog.
   * @required
   */
  message: string;
  /**
   * Secondary text to display under the primary message.
   */
  body?: string;
  /**
   * A list of buttons to display when the `type` property is set to `SkyConfirmType.Custom`.
   */
  buttons?: SkyConfirmButtonConfig[];
  /**
   * Whether to preserve whitespace and new lines inside the dialog.
   * @default false
   */
  preserveWhiteSpace?: boolean;
  /**
   * A preset button configuration for the dialog.
   */
  type?: SkyConfirmType;
}
