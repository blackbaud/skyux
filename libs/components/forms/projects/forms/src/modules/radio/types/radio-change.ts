import {
  SkyRadioComponent
} from '../radio.component';

export interface SkyRadioChange {
  /**
   * Specifies the radio component that triggered the change event.
   * @internal
   */
  source: SkyRadioComponent;
  /**
   * Specifies the value from the radio component.
   */
  value: any;
}
