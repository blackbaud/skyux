import { SkyCheckboxComponent } from './checkbox.component';

// TODO: Change this to be an interface.
/**
 * Fires when users select or deselect the checkbox.
 */
export interface SkyCheckboxChange {
  source?: SkyCheckboxComponent;
  checked?: boolean;
}
