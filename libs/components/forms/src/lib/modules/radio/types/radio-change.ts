import { SkyRadioComponent } from '../radio.component';

/**
 * Fires when users select a radio button.
 */
export interface SkyRadioChange {
  /**
   * The radio component that triggered the change event.
   * @internal
   * @deprecated
   */
  source: SkyRadioComponent;
  /**
   * The value from the radio component.
   */
  value: any;
}
