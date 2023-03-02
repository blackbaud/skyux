import { SkyRadioComponent } from '../radio.component';

export interface SkyRadioChange {
  /**
   * The radio component that triggered the change event.
   * @internal
   */
  source: SkyRadioComponent;
  /**
   * The value from the radio component.
   */
  value: any;
}
