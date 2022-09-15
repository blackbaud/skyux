import { SkyCheckboxComponent } from './checkbox.component';

// TODO: Change this to be an interface.
/**
 * Fires when users select or deselect the checkbox.
 */
export class SkyCheckboxChange {
  public source: SkyCheckboxComponent | undefined;
  public checked: boolean | undefined;
}
