import { SkyCheckboxComponent } from './checkbox.component';

/**
 * Fires when users select or deselect the checkbox.
 */
export class SkyCheckboxChange {
  public source: SkyCheckboxComponent;
  public checked: boolean;
}
