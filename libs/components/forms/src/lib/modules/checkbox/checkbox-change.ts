import { SkyCheckboxComponent } from './checkbox.component';

// TODO: Change this to be an interface.
/**
 * Fires when users select or deselect the checkbox.
 */
export interface SkyCheckboxChange {
  // TODO: Consider if we should still be exporting this component as it makes it a part of our public API
  source?: SkyCheckboxComponent;
  checked?: boolean;
}
