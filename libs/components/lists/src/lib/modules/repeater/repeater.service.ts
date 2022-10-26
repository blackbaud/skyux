import { EventEmitter, Injectable, OnDestroy } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { SkyRepeaterExpandModeType } from './repeater-expand-mode-type';
import { SkyRepeaterItemRolesType } from './repeater-item-roles.type';
import { SkyRepeaterItemComponent } from './repeater-item.component';

let uniqueId = 0;
const DEFAULT_EXPAND_MODE: SkyRepeaterExpandModeType = 'none';

/**
 * @internal
 */
@Injectable()
export class SkyRepeaterService implements OnDestroy {
  public activeItemChange = new BehaviorSubject<
    SkyRepeaterItemComponent | undefined
  >(undefined);

  public activeItemIndexChange = new BehaviorSubject<number | undefined>(
    undefined
  );

  public enableActiveState = false;

  // TODO: Remove 'string' as a valid type in a breaking change.
  public get expandMode(): SkyRepeaterExpandModeType | string {
    return this.#_expandMode;
  }
  public set expandMode(value: SkyRepeaterExpandModeType | string | undefined) {
    this.#_expandMode = value ?? DEFAULT_EXPAND_MODE;
  }

  public itemCollapseStateChange = new EventEmitter<SkyRepeaterItemComponent>();

  public items: SkyRepeaterItemComponent[] = [];

  public readonly itemRole = new BehaviorSubject<SkyRepeaterItemRolesType>({
    content: undefined,
    item: undefined,
    title: undefined,
  });

  public orderChange = new BehaviorSubject<void>(undefined);

  public repeaterGroupId = ++uniqueId;

  #_expandMode: SkyRepeaterExpandModeType | string = DEFAULT_EXPAND_MODE;

  public ngOnDestroy(): void {
    this.activeItemChange.complete();
    this.itemCollapseStateChange.complete();
    this.orderChange.complete();
  }

  public activateItem(item: SkyRepeaterItemComponent): void {
    if (this.enableActiveState) {
      /* istanbul ignore else */
      if (item && !item.disabled) {
        const index = this.items.findIndex((i) => i === item);
        this.activeItemIndexChange.next(index);
        this.activeItemChange.next(item);
      }
    }
  }

  public activateItemByIndex(index: number | undefined): void {
    /* istanbul ignore else */
    if (this.enableActiveState) {
      if (index === undefined) {
        this.activeItemChange.next(undefined);
      } else {
        const activeItem = this.items[index];
        if (activeItem && !activeItem.disabled) {
          this.activeItemChange.next(activeItem);
        }
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

  public registerOrderChange(): void {
    this.orderChange.next();
  }

  public reorderItem(oldIndex: number, newIndex: number): void {
    this.items.splice(newIndex, 0, this.items.splice(oldIndex, 1)[0]);
  }
}
