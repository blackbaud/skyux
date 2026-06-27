import { Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

interface DropdownItem {
  name: string;
  disabled: boolean;
}

/**
 * @title Dropdown with basic setup
 */
@Component({
  selector: 'app-popovers-dropdown-basic-example',
  templateUrl: './example.component.html',
  imports: [SkyDropdownModule],
})
export class PopoversDropdownBasicExampleComponent {
  protected items: DropdownItem[] = [
    { name: 'Option 1', disabled: false },
    { name: 'Disabled option', disabled: true },
    { name: 'Option 3', disabled: false },
    { name: 'Option 4', disabled: false },
    { name: 'Option 5', disabled: false },
  ];

  public actionClicked(action: string): void {
    alert(`You selected ${action}.`);
  }
}
