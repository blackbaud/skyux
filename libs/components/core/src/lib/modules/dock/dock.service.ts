import { ComponentRef, Injectable, Type } from '@angular/core';

import { SkyDockItem } from './dock-item';

import { SkyDockComponent } from './dock.component';

import { SkyDockInsertComponentConfig } from './dock-insert-component-config';

import { SkyDockLocation } from './dock-location';

import { SkyDockOptions } from './dock-options';

import { SkyDynamicComponentLocation } from '../dynamic-component/dynamic-component-location';

import { SkyDynamicComponentOptions } from '../dynamic-component/dynamic-component-options';

import { SkyDynamicComponentService } from '../dynamic-component/dynamic-component.service';

import { sortByStackOrder } from './sort-by-stack-order';

/**
 * This service docks components to specific areas on the page.
 */
@Injectable({
  providedIn: 'root',
})
export class SkyDockService {
  /**
   * Returns all docked items.
   */
  public get items(): SkyDockItem<any>[] {
    return this._items;
  }

  private dockRef: ComponentRef<SkyDockComponent>;

  private options: SkyDockOptions;

  private _items: SkyDockItem<any>[] = [];

  constructor(private dynamicComponentService: SkyDynamicComponentService) {}

  /**
   * Docks a component to the bottom of the page.
   * @param component The component to dock.
   * @param config Options that affect the docking action.
   */
  public insertComponent<T>(
    component: Type<T>,
    config?: SkyDockInsertComponentConfig
  ): SkyDockItem<T> {
    if (!this.dockRef) {
      this.createDock();
    }

    const itemRef = this.dockRef.instance.insertComponent(component, config);
    const item = new SkyDockItem(
      itemRef.componentRef.instance,
      itemRef.stackOrder
    );

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

  /**
   * Sets options for the positioning and styling of the dock component. Since the dock service is a
   * singleton instance, these options will be applied to all components inserted into the dock. In
   * order to create a seperate dock with different options, consumers should provide a different
   * instance of the dock service.
   * @param options The options for positioning and styling
   */
  public setDockOptions(options: SkyDockOptions): void {
    this.options = options;
  }

  private createDock(): void {
    let dockOptions: SkyDynamicComponentOptions;

    if (this.options) {
      let dynamicLocation: SkyDynamicComponentLocation;
      switch (this.options.location) {
        case SkyDockLocation.BeforeElement:
          dynamicLocation = SkyDynamicComponentLocation.BeforeElement;
          break;
        case SkyDockLocation.ElementBottom:
          dynamicLocation = SkyDynamicComponentLocation.ElementBottom;
          break;
        default:
          dynamicLocation = SkyDynamicComponentLocation.BodyTop;
          break;
      }

      dockOptions = {
        location: dynamicLocation,
        referenceEl: this.options.referenceEl,
      };
    }

    this.dockRef = this.dynamicComponentService.createComponent(
      SkyDockComponent,
      dockOptions
    );
    this.dockRef.instance.setOptions(this.options);
  }

  private destroyDock(): void {
    this.dynamicComponentService.removeComponent(this.dockRef);
    this.dockRef = undefined;
  }
}
