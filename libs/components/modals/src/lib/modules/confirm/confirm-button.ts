import { SkyConfirmButtonAction } from './confirm-button-action';
import { SkyConfirmButtonStyleType } from './confirm-button-style-type';

/**
 * The view model for button configuration that the confirm component uses.
 * @internal
 */
export interface SkyConfirmButton {
  action: SkyConfirmButtonAction;
  // TODO: Remove 'string' in a breaking change.
  styleType: SkyConfirmButtonStyleType | string;
  text: string;
  autofocus?: boolean;
}
