import {
  ChangeDetectorRef,
  Component,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';

import { Subject } from 'rxjs';

import { SkyDropdownItemComponent } from '../dropdown-item.component';
import { SkyDropdownMenuComponent } from '../dropdown-menu.component';
import { SkyDropdownComponent } from '../dropdown.component';
import { SkyDropdownHorizontalAlignment } from '../types/dropdown-horizontal-alignment';
import { SkyDropdownMessage } from '../types/dropdown-message';
import { SkyDropdownMessageType } from '../types/dropdown-message-type';
import { SkyDropdownTriggerType } from '../types/dropdown-trigger-type';

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './dropdown.component.fixture.html',
})
export class DropdownFixtureComponent {
  //#region directive properties

  public buttonStyle: string;

  public buttonType: string;

  public disabled: boolean;

  public dismissOnBlur: boolean;

  public horizontalAlignment: SkyDropdownHorizontalAlignment;

  public itemAriaRole: string;

  public label: string;

  public messageStream = new Subject<SkyDropdownMessage>();

  public menuAriaLabelledBy: string;

  public menuAriaRole: string;

  public title: string;

  public trigger: SkyDropdownTriggerType;

  public useNativeFocus: boolean;

  //#endregion directive properties

  @ViewChild('dropdownRef', {
    read: SkyDropdownComponent,
  })
  public dropdownRef: SkyDropdownComponent;

  @ViewChild('dropdownMenuRef', {
    read: SkyDropdownMenuComponent,
  })
  public dropdownMenuRef: SkyDropdownMenuComponent;

  @ViewChildren(SkyDropdownItemComponent)
  public dropdownItemRefs: QueryList<SkyDropdownItemComponent>;

  public items: any[] = [
    { name: 'Option 1', disabled: false },
    { name: 'Option 2', disabled: true },
    { name: 'Option 3', disabled: false },
    { name: 'Option 4', disabled: false },
  ];

  public show = true;

  constructor(private changeDetector: ChangeDetectorRef) {}

  public onMenuChanges(): void {}

  public onItemClick(): void {}

  public changeItems() {
    this.items.pop();
    this.changeDetector.detectChanges();
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
    this.changeDetector.markForCheck();
  }

  public sendMessage(type: SkyDropdownMessageType) {
    this.messageStream.next({ type });
  }
}
