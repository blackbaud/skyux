import { SkyCheckboxComponent } from './checkbox.component';

/**
 * Fires when users select or deselect the checkbox.
 */
export interface SkyCheckboxChange {
  // TODO: Remove in a future version
  /**
   * The checkbox component that triggered the change.
   * @deprecated
   */
  source?: SkyCheckboxComponent;

  /**
   * The value from the checkbox component.
   */
  checked?: boolean;
}
