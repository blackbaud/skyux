import { SkyConfirmButtonAction } from './confirm-button-action';

/**
 * The view-model for button configuration used by the confirm component.
 * @internal
 */
export interface SkyConfirmButton {
  action: SkyConfirmButtonAction;
  styleType: string;
  text: string;
  autofocus?: boolean;
}
