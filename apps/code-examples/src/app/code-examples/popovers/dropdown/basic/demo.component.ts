import { Component } from '@angular/core';
import { SkyDropdownModule } from '@skyux/popovers';

interface DropdownItem {
  name: string;
  disabled: boolean;
}

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyDropdownModule],
})
export class DemoComponent {
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
