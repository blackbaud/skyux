import { Component, ViewChild } from '@angular/core';

import { SkyRepeaterExpandModeType } from '../repeater-expand-mode-type';
import { SkyRepeaterComponent } from '../repeater.component';

let nextItemId = 0;

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './repeater.component.fixture.html',
  standalone: false,
})
export class RepeaterTestComponent {
  public set activeIndex(value: number | undefined) {
    this.#_activeIndex = value;
  }

  public get activeIndex(): number | undefined {
    return this.#_activeIndex;
  }

  public disableFirstItem = false;

  public expandMode: SkyRepeaterExpandModeType | undefined = 'single';

  public items: { id?: string; title: string }[] | undefined = [
    {
      id: 'item1',
      title: 'Title 1',
    },
    {
      id: 'item2',
      title: 'Title 2',
    },
    {
      id: 'item3',
      title: 'Title 3',
    },
  ];

  public lastItemExpanded: boolean | undefined;

  public lastItemSelected = false;

  public removeLastItem: boolean | undefined;

  public reorderable = false;

  public selectable: boolean | undefined = false;

  public showContextMenu: boolean | undefined;

  public showItemName = false;

  public showDynamicContent: boolean | undefined;

  public showItemWithNoContent: boolean | undefined;

  public showItemWithNoTitle: boolean | undefined;

  public showRepeaterWithActiveIndex = false;

  public showRepeaterWithNgFor = false;

  public sortedItemTags: any[] | undefined;

  @ViewChild(SkyRepeaterComponent, {
    read: SkyRepeaterComponent,
    static: false,
  })
  public repeater: SkyRepeaterComponent | undefined;

  #_activeIndex: number | undefined;

  public onCollapse(): void {}

  public onExpand(): void {}

  public onIsSelectedChange(value: boolean): void {}

  public addItem(): void {
    const newItem = {
      id: `item${nextItemId++}`,
      title: 'New record ' + nextItemId,
    };
    this.items?.push(newItem);
  }

  public onOrderChange(tags: any[]): void {
    this.sortedItemTags = tags;
  }
}
