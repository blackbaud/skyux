import { SkyDropdownItemComponent } from '../dropdown-item.component';

export interface SkyDropdownMenuChange {
  activeIndex?: number;
  items?: SkyDropdownItemComponent[];
  selectedItem?: SkyDropdownItemComponent;
}
