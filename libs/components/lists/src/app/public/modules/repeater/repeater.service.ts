import {
  EventEmitter,
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  SkyRepeaterItemComponent
} from './repeater-item.component';

@Injectable()
export class SkyRepeaterService implements OnDestroy {

  public activeItemChange = new BehaviorSubject<SkyRepeaterItemComponent>(undefined);

  public itemCollapseStateChange = new EventEmitter<SkyRepeaterItemComponent>();

  public items: SkyRepeaterItemComponent[] = [];

  public ngOnDestroy(): void {
    this.activeItemChange.complete();
    this.itemCollapseStateChange.complete();
  }

  public activateItemByIndex(index: number): void {
    if (index === undefined) {
      this.activeItemChange.next(undefined);
    } else {
      const activeItem = this.items[index];
      if (activeItem) {
        this.activeItemChange.next(activeItem);
      }
    }
  }

  public registerItem(item: SkyRepeaterItemComponent): void {
    this.items.push(item);
  }

  public unregisterItem(item: SkyRepeaterItemComponent): void {
    const indexOfDestroyedItem = this.items.indexOf(item);
    if (indexOfDestroyedItem > -1) {
      this.items.splice(indexOfDestroyedItem, 1);
    }
  }

  public onItemCollapseStateChange(item: SkyRepeaterItemComponent): void {
    this.itemCollapseStateChange.emit(item);
  }

  public getItemIndex(item: SkyRepeaterItemComponent): number {
    return this.items.indexOf(item);
  }

  public reorderItem(oldIndex: number, newIndex: number): void {
    this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0]);
  }
}
