import { ComponentRef, Injectable, Type, inject } from '@angular/core';

import { Subscription } from 'rxjs';

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
  providedIn: 'root',
})
export class SkyDockService {
  private static dockRef: ComponentRef<SkyDockComponent> | undefined;
  private static _items: SkyDockItem<any>[] = [];

  /**
   * Returns all docked items.
   */
  public get items(): SkyDockItem<any>[] {
    return SkyDockService._items;
  }

  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  #subscription: Subscription | undefined;

  #options: SkyDockOptions | undefined;

  /**
   * Docks a component to the bottom of the page.
   * @param component The component to dock.
   * @param config Options that affect the docking action.
   */
  public insertComponent<T>(
    component: Type<T>,
    config?: SkyDockInsertComponentConfig,
  ): SkyDockItem<T> {
    this.#subscription ??= new Subscription();
    const dockRef = (SkyDockService.dockRef =
      SkyDockService.dockRef || this.#createDock());

    const itemRef = dockRef.instance.insertComponent(component, config);
    const item = new SkyDockItem(
      itemRef.componentRef.instance,
      itemRef.stackOrder,
    );

    this.#subscription?.add(
      item.destroyed.subscribe(() => {
        dockRef.instance.removeItem(itemRef);
        SkyDockService._items.splice(SkyDockService._items.indexOf(item), 1);
        if (SkyDockService._items.length === 0) {
          this.#destroyDock();
        }
      }),
    );

    SkyDockService._items.push(item);
    SkyDockService._items.sort(sortByStackOrder);

    return item;
  }

  /**
   * Sets options for the positioning and styling of the dock component. Since the dock service is a
   * singleton instance, these options will be applied to all components inserted into the dock. In
   * order to create a separate dock with different options, consumers should provide a different
   * instance of the dock service.
   * @param options The options for positioning and styling
   */
  public setDockOptions(options: SkyDockOptions): void {
    this.#options = options;
  }

  #createDock(): ComponentRef<SkyDockComponent> {
    let dockOptions: SkyDynamicComponentOptions | undefined;

    if (this.#options) {
      let dynamicLocation: SkyDynamicComponentLocation;
      switch (this.#options.location) {
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
        referenceEl: this.#options.referenceEl,
      };
    }

    const dockRef = this.#dynamicComponentSvc.createComponent(
      SkyDockComponent,
      dockOptions,
    );

    dockRef.instance.setOptions(this.#options);

    return dockRef;
  }

  #destroyDock(): void {
    this.#subscription?.unsubscribe();
    this.#subscription = undefined;
    this.#dynamicComponentSvc.removeComponent(SkyDockService.dockRef);
    SkyDockService.dockRef = undefined;
  }
}
