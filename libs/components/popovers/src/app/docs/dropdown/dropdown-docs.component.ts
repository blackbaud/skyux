import {
  ChangeDetectionStrategy,
  Component
} from '@angular/core';

import {
  SkyDocsDemoControlPanelChange,
  SkyDocsDemoControlPanelRadioChoice
} from '@skyux/docs-tools';

interface DropdownItem {
  disabled: boolean;
  name: string;
}

@Component({
  selector: 'app-dropdown-docs',
  templateUrl: './dropdown-docs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownDocsComponent {

  public defaultItems: DropdownItem[] = [
    { name: 'Addresses', disabled: false },
    { name: 'Email addresses', disabled: false },
    { name: 'Phone numbers', disabled: false }
  ];

  public contextItems: DropdownItem[] = [
    { name: 'Edit', disabled: false },
    { name: 'Mark inactive', disabled: false },
    { name: 'Delete', disabled: false }
  ];

  public items: DropdownItem[] = this.defaultItems;

  public buttonChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'select', label: 'Default' },
    { value: 'pencil', label: 'Icon Only' },
    { value: 'context-menu', label: 'Context menu' }
  ];

  public styleChoices: SkyDocsDemoControlPanelRadioChoice[] = [
    { value: 'default', label: 'Default' },
    { value: 'primary', label: 'Primary' }
  ];

  public demoSettings: any = {};

  public get showAlignmentOptions(): boolean {
    const placement = this.demoSettings.skyPopoverPlacement;

    return (placement === 'above' || placement === 'below');
  }

  public onDemoSelectionChange(change: SkyDocsDemoControlPanelChange): void {
    if (change.button) {
      this.demoSettings.button = change.button;
      if (change.button === 'context-menu') {
        this.items = this.contextItems;
      } else {
        this.items = this.defaultItems;
      }
    }

    if (change.style) {
      this.demoSettings.style = change.style;
    }
  }
}
