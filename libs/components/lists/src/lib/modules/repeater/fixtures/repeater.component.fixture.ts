import { Component, ViewChild, input, model } from '@angular/core';

import { SkyRepeaterExpandModeType } from '../repeater-expand-mode-type';
import { SkyRepeaterComponent } from '../repeater.component';

let nextItemId = 0;

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './repeater.component.fixture.html',
  standalone: false,
})
export class RepeaterTestComponent {
  public activeIndex = model<number | undefined>(undefined);

  public disableFirstItem = input<boolean>(false);

  public expandMode = input<SkyRepeaterExpandModeType | undefined>('single');

  public items = model<{ id?: string; title: string }[] | undefined>([
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
  ]);

  public lastItemExpanded = input<boolean | undefined>(undefined);

  public lastItemSelected = model<boolean>(false);

  public removeLastItem = input<boolean | undefined>(undefined);

  public reorderable = input<boolean>(false);

  public selectable = input<boolean | undefined>(false);

  public showContextMenu = input<boolean | undefined>(undefined);

  public showItemName = input<boolean>(false);

  public showDynamicContent = input<boolean | undefined>(undefined);

  public showItemWithNoContent = input<boolean | undefined>(undefined);

  public showItemWithNoTitle = input<boolean | undefined>(undefined);

  public showRepeaterWithActiveIndex = input<boolean>(false);

  public showRepeaterWithNgFor = input<boolean>(false);

  public sortedItemTags: any[] | undefined;

  @ViewChild(SkyRepeaterComponent, {
    read: SkyRepeaterComponent,
    static: false,
  })
  public repeater: SkyRepeaterComponent | undefined;

  public onCollapse(): void {}

  public onExpand(): void {}

  public onIsSelectedChange(value: boolean): void {}

  public addItem(): void {
    const newItem = {
      id: `item${nextItemId++}`,
      title: 'New record ' + nextItemId,
    };
    this.items.update((arr) => [...(arr ?? []), newItem]);
  }

  public onOrderChange(tags: any[]): void {
    this.sortedItemTags = tags;
  }
}
