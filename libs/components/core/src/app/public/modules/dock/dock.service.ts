import {
  ComponentRef,
  Injectable,
  Type
} from '@angular/core';

import {
  SkyDynamicComponentService
} from '@skyux/core';

import {
  SkyDockItem
} from './dock-item';

import {
  SkyDockComponent
} from './dock.component';

import {
  SkyDockInsertComponentConfig
} from './dock-insert-component-config';

import {
  sortByStackOrder
} from './sort-by-stack-order';

/**
 * This service docks components to specific areas on the page.
 */
@Injectable()
export class SkyDockService {

  /**
   * Returns all docked items.
   */
  public get items(): SkyDockItem<any>[] {
    return this._items;
  }

  private dockRef: ComponentRef<SkyDockComponent>;

  private _items: SkyDockItem<any>[] = [];

  constructor(
    private dynamicComponentService: SkyDynamicComponentService
  ) { }

  /**
   * Docks a component to the bottom of the page.
   * @param component The component to dock.
   * @param config Options that affect the docking action.
   */
  public insertComponent<T>(component: Type<T>, config?: SkyDockInsertComponentConfig): SkyDockItem<T> {
    if (!this.dockRef) {
      this.createDock();
    }

    const itemRef = this.dockRef.instance.insertComponent(component, config);
    const item = new SkyDockItem(itemRef.componentRef.instance, itemRef.stackOrder);

    item.destroyed.subscribe(() => {
      this.dockRef.instance.removeItem(itemRef);
      this._items.splice(this._items.indexOf(item), 1);
      if (this._items.length === 0) {
        this.destroyDock();
      }
    });

    this._items.push(item);
    this._items.sort(sortByStackOrder);

    return item;
  }

  private createDock(): void {
    this.dockRef = this.dynamicComponentService.createComponent(SkyDockComponent);
  }

  private destroyDock(): void {
    this.dynamicComponentService.removeComponent(this.dockRef);
    this.dockRef = undefined;
  }

}
