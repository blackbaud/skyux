import {
  ChangeDetectorRef,
  Component
} from '@angular/core';

import {
  SkyDropdownMessage,
  SkyDropdownMessageType,
  SkyDropdownMenuChange
} from '@skyux/popovers';

import {
  Subject
} from 'rxjs';

@Component({
  selector: 'app-dropdown-demo',
  templateUrl: './dropdown-demo.component.html'
})
export class DropdownDemoComponent {

  public dropdownController = new Subject<SkyDropdownMessage>();

  public items: any[] = [
    { name: 'Option 1', disabled: false },
    { name: 'Disabled option', disabled: true },
    { name: 'Option 3', disabled: false },
    { name: 'Option 4', disabled: false },
    { name: 'Option 5', disabled: false }
  ];

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public actionClicked(action: string): void {
    alert(`You selected ${action}.`);
  }

  public openDropdown(): void {
    this.sendMessage(SkyDropdownMessageType.Open);
  }

  public closeDropdown(): void {
    this.sendMessage(SkyDropdownMessageType.Close);
  }

  public focusTriggerButton(): void {
    this.sendMessage(SkyDropdownMessageType.FocusTriggerButton);
  }

  public focusNextItem(): void {
    this.sendMessage(SkyDropdownMessageType.FocusNextItem);
  }

  public focusPreviousItem(): void {
    this.sendMessage(SkyDropdownMessageType.FocusPreviousItem);
  }

  public changeItems(): void {
    this.items.pop();
    this.changeDetector.detectChanges();
  }

  public onMenuChanges(change: SkyDropdownMenuChange): void {
    if (change.activeIndex !== undefined) {
      console.log(`The menu's active index changed to: ${change.activeIndex}.`);
    }
  }

  private sendMessage(type: SkyDropdownMessageType): void {
    const message: SkyDropdownMessage = { type };
    this.dropdownController.next(message);
  }
}
