import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdown-demo',
  templateUrl: './dropdown.component.html',
})
export class DropdownComponent {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public items: any[] = [
    { name: 'Option 1', disabled: false },
    { name: 'Disabled option', disabled: true },
    { name: 'Option 3', disabled: false },
    { name: 'Option 4', disabled: false },
    { name: 'Option 5', disabled: false },
  ];

  public actionClicked(action: string): void {
    alert(`You selected ${action}.`);
  }

  public toggleOptions(): void {
    this.items[1].disabled = !this.items[1].disabled;
  }
}
