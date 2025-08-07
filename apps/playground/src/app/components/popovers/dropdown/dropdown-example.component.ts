import { Component, input, signal } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';

@Component({
  selector: 'app-dropdown-example',
  imports: [SkyDropdownModule, SkyIconModule],
  templateUrl: './dropdown-example.component.html',
  styleUrl: './dropdown-example.component.scss',
})
export class DropdownExampleComponent {
  public readonly disabledState = input(true);
  protected readonly notDisabled = signal(false);

  public items = [
    { name: 'Option 1', disabled: this.notDisabled },
    { name: 'Disabled option', disabled: this.disabledState },
    { name: 'Option 3', disabled: this.notDisabled },
    { name: 'Option 4', disabled: this.notDisabled },
    { name: 'Option 5', disabled: this.notDisabled },
  ];

  public actionClicked(action: string): void {
    alert(`You selected ${action}.`);
  }
}
