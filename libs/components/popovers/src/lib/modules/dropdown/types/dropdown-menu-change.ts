import { SkyDropdownItemComponent } from '../dropdown-item.component';

/**
 * Menu items, including the selected one.
 * @internal
 */
export interface SkyDropdownMenuChange {
  /**
   * The active menu index.
   */
  activeIndex?: number;

  /**
   * The items in the menu.
   */
  items?: SkyDropdownItemComponent[];

  /**
   * The selected item in the menu.
   */
  selectedItem?: SkyDropdownItemComponent;
}
