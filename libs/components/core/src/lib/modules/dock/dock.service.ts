import { ComponentRef, Injectable, Type } from '@angular/core';

import { SkyDynamicComponentLocation } from '../dynamic-component/dynamic-component-location';
import { SkyDynamicComponentOptions } from '../dynamic-component/dynamic-component-options';
import { SkyDynamicComponentService } from '../dynamic-component/dynamic-component.service';

import { SkyDockInsertComponentConfig } from './dock-insert-component-config';
import { SkyDockItem } from './dock-item';
import { SkyDockLocation } from './dock-location';
import { SkyDockOptions } from './dock-options';
import { SkyDockComponent } from './dock.component';
import { sortByStackOrder } from './sort-by-stack-order';

/**
 * This service docks components to specific areas on the page.
 */
@Injectable({
  // Must be 'any' so that the dock component is created in the context of its module's injector.
  // If set to 'root', the component's dependency injections would only be derived from the root
  // injector and may loose context if the dock was opened from within a lazy-loaded module.
  providedIn: 'any',
})
export class SkyDockService {
  private static dockRef: ComponentRef<SkyDockComponent>;
  private static _items: SkyDockItem<any>[] = [];

  /**
   * Returns all docked items.
   */
  public get items(): SkyDockItem<any>[] {
    return SkyDockService._items;
  }

  private options: SkyDockOptions;

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
    if (!SkyDockService.dockRef) {
      this.createDock();
    }

    const itemRef = SkyDockService.dockRef.instance.insertComponent(
      component,
      config
    );
    const item = new SkyDockItem(
      itemRef.componentRef.instance,
      itemRef.stackOrder
    );

    item.destroyed.subscribe(() => {
      SkyDockService.dockRef.instance.removeItem(itemRef);
      SkyDockService._items.splice(SkyDockService._items.indexOf(item), 1);
      if (SkyDockService._items.length === 0) {
        this.destroyDock();
      }
    });

    SkyDockService._items.push(item);
    SkyDockService._items.sort(sortByStackOrder);

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

    SkyDockService.dockRef = this.dynamicComponentService.createComponent(
      SkyDockComponent,
      dockOptions
    );
    SkyDockService.dockRef.instance.setOptions(this.options);
  }

  private destroyDock(): void {
    this.dynamicComponentService.removeComponent(SkyDockService.dockRef);
    SkyDockService.dockRef = undefined;
  }
}
