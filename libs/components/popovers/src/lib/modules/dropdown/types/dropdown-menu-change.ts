import { SkyDropdownItemComponent } from '../dropdown-item.component';

/**
 * Specifies menu items, including the selected one.
 */
export interface SkyDropdownMenuChange {
  /**
   * Indicates the active menu index.
   */
  activeIndex?: number;

  /**
   * Indicates the items in the menu.
   */
  items?: SkyDropdownItemComponent[];

  /**
   * Indicates the selected item in the menu.
   */
  selectedItem?: SkyDropdownItemComponent;
}
