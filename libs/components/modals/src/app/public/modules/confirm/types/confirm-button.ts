import {
  SkyConfirmButtonAction
} from './confirm-button-action';

export interface SkyConfirmButton {
  action: SkyConfirmButtonAction;
  styleType: string;
  text: string;
  autofocus?: boolean;
}
