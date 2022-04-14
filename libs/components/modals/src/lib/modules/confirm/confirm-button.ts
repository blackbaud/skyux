import { SkyConfirmButtonAction } from './confirm-button-action';

/**
 * The view model for button configuration that the confirm component uses.
 * @internal
 */
export interface SkyConfirmButton {
  action: SkyConfirmButtonAction;
  styleType: string;
  text: string;
  autofocus?: boolean;
}
