import {
  Component,
  ViewChild
} from '@angular/core';

import {
  SkyRepeaterComponent
} from '../repeater.component';

let nextItemId: number = 0;

@Component({
  selector: 'sky-test-cmp',
  templateUrl: './repeater.component.fixture.html'
})
export class RepeaterTestComponent {

  public set activeIndex(value: number) {
    this._activeIndex = value;
  }

  public get activeIndex(): number {
    return this._activeIndex;
  }

  public expandMode = 'single';

  public items = [
    {
      id: 'item1',
      title: 'Item 1'
    },
    {
      id: 'item2',
      title: 'Item 2'
    },
    {
      id: 'item3',
      title: 'Item 3'
    }
  ];

  public lastItemExpanded: boolean;

  public lastItemSelected = false;

  public removeLastItem: boolean;

  public reorderable = false;

  public selectable = false;

  public showContextMenu: boolean;

  public showDynamicContent: boolean;

  public showItemWithNoContent: boolean;

  public showRepeaterWithActiveIndex = false;

  public showRepeaterWithNgFor = false;

  public sortedItemTags: any[];

  @ViewChild(SkyRepeaterComponent)
  public repeater: SkyRepeaterComponent;

  private _activeIndex: number;

  public onCollapse(): void {}

  public onExpand(): void {}

  public onIsSelectedChange(value: boolean): void {}

  public addItem(): void {
    const newItem = {
      id: `item${nextItemId++}`,
      title: 'New record ' + nextItemId
    };
    this.items.push(newItem);
  }

  public onOrderChange(tags: any[]): void {
    this.sortedItemTags = tags;
  }
}
