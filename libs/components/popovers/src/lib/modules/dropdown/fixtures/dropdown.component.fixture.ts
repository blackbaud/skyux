import {
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
  inject,
  input,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyDropdownItemComponent } from '../dropdown-item.component';
import { SkyDropdownMenuComponent } from '../dropdown-menu.component';
import { SkyDropdownComponent } from '../dropdown.component';
import { SkyDropdownButtonType } from '../types/dropdown-button-type';
import { SkyDropdownHorizontalAlignment } from '../types/dropdown-horizontal-alignment';
import { SkyDropdownMessage } from '../types/dropdown-message';
import { SkyDropdownMessageType } from '../types/dropdown-message-type';
import { SkyDropdownTriggerType } from '../types/dropdown-trigger-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './dropdown.component.fixture.html',
  standalone: false,
})
export class DropdownFixtureComponent {
  //#region directive properties

  public buttonStyle: string | undefined;

  public buttonType: SkyDropdownButtonType | string | undefined;

  public disabled: boolean | undefined;

  public horizontalAlignment: SkyDropdownHorizontalAlignment | undefined;

  public itemAriaRole = input<string | undefined>(undefined);

  public label = input<string | undefined>(undefined);

  public messageStream = new Subject<SkyDropdownMessage>();

  public menuAriaLabelledBy = input<string | undefined>(undefined);

  public menuAriaRole = input<string | undefined>(undefined);

  public title = input<string | undefined>(undefined);

  public trigger: SkyDropdownTriggerType | undefined;

  public useNativeFocus: boolean | undefined;

  public useCustomTrigger = false;

  //#endregion directive properties

  @ViewChild('dropdownRef', {
    read: SkyDropdownComponent,
  })
  public dropdownRef: SkyDropdownComponent | undefined;

  @ViewChild('dropdownMenuRef', {
    read: SkyDropdownMenuComponent,
  })
  public dropdownMenuRef: SkyDropdownMenuComponent | undefined;

  @ViewChildren(SkyDropdownItemComponent)
  public dropdownItemRefs: QueryList<SkyDropdownItemComponent> | undefined;

  public items: any[] = [
    { name: 'Option 1', disabled: false },
    { name: 'Option 2', disabled: true },
    { name: 'Option 3', disabled: false },
    { name: 'Option 4', disabled: false },
  ];

  public show = input<boolean>(true);

  readonly #changeDetector = inject(ChangeDetectorRef);

  public onMenuChanges(): void {}

  public onItemClick(): void {}

  public changeItems() {
    this.items.pop();
    this.#changeDetector.detectChanges();
  }

  public setManyItems(): void {
    const items: any[] = [];

    for (let i = 0; i < 50; i++) {
      items.push({
        name: `Option ${i}`,
        disabled: false,
      });
    }

    this.items = items;
    this.#changeDetector.markForCheck();
  }

  public sendMessage(type: SkyDropdownMessageType) {
    this.messageStream.next({ type });
  }

  public setItems(items: any[]): void {
    this.items = items;
    this.#changeDetector.markForCheck();
  }
}
