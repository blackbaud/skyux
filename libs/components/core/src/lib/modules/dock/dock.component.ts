import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EnvironmentInjector,
  Type,
  ViewChild,
  ViewContainerRef,
  inject,
} from '@angular/core';

import { SkyDynamicComponentService } from '../dynamic-component/dynamic-component.service';

import { SkyDockDomAdapterService } from './dock-dom-adapter.service';
import { SkyDockInsertComponentConfig } from './dock-insert-component-config';
import { SkyDockItemReference } from './dock-item-reference';
import { SkyDockLocation } from './dock-location';
import { SkyDockOptions } from './dock-options';
import { sortByStackOrder } from './sort-by-stack-order';

/**
 * @internal
 */
@Component({
  selector: 'sky-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  providers: [SkyDockDomAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyDockComponent {
  @ViewChild('target', {
    read: ViewContainerRef,
    static: true,
  })
  public target: ViewContainerRef | undefined;

  #itemRefs: SkyDockItemReference<unknown>[] = [];

  #options: SkyDockOptions | undefined;

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #domAdapter = inject(SkyDockDomAdapterService);
  readonly #dynamicComponentSvc = inject(SkyDynamicComponentService);
  readonly #elementRef = inject(ElementRef);
  readonly #environmentInjector = inject(EnvironmentInjector);

  public insertComponent<T>(
    component: Type<T>,
    config: SkyDockInsertComponentConfig = {},
  ): SkyDockItemReference<T> {
    /*istanbul ignore if: untestable*/
    if (!this.target) {
      throw Error(
        '[SkyDockComponent] Could not insert the component because the target element could not be found.',
      );
    }

    const componentRef = this.#dynamicComponentSvc.createComponent(component, {
      environmentInjector: this.#environmentInjector,
      providers: config.providers,
      viewContainerRef: this.target,
    });

    const stackOrder =
      config.stackOrder !== null && config.stackOrder !== undefined
        ? config.stackOrder
        : this.#getHighestStackOrder();

    this.#itemRefs.push({
      componentRef,
      stackOrder,
    });

    this.#sortItemsByStackOrder();

    this.#changeDetector.markForCheck();

    return {
      componentRef,
      stackOrder,
    };
  }

  public removeItem(item: SkyDockItemReference<any>): void {
    /*istanbul ignore if: untestable*/
    if (!this.target) {
      throw Error(
        '[SkyDockComponent] Could not remove the item because the target element could not be found.',
      );
    }

    const viewRef = item.componentRef.hostView;
    this.target.remove(this.target.indexOf(viewRef));

    const found = this.#itemRefs.find(
      (i) => i.componentRef.hostView === viewRef,
    );

    if (found) {
      this.#itemRefs.splice(this.#itemRefs.indexOf(found), 1);
    }
  }

  public setOptions(options: SkyDockOptions | undefined): void {
    this.#options = options;

    switch (this.#options?.location) {
      case SkyDockLocation.BeforeElement:
        this.#domAdapter.unbindDock(this.#elementRef);
        break;
      case SkyDockLocation.ElementBottom:
        this.#domAdapter.setSticky(this.#elementRef);
        break;
      case SkyDockLocation.BodyBottom:
      default:
        this.#domAdapter.watchDomChanges(this.#elementRef);
        break;
    }

    if (this.#options?.zIndex) {
      this.#domAdapter.setZIndex(this.#options.zIndex, this.#elementRef);
    }
  }

  #sortItemsByStackOrder(): void {
    if (this.target) {
      this.#itemRefs.sort(sortByStackOrder);

      // Reassign the correct index for each view.
      for (let i = 0, len = this.#itemRefs.length; i < len; i++) {
        const item = this.#itemRefs[i];
        this.target.move(item.componentRef.hostView, i);
      }
    }
  }

  #getHighestStackOrder(): number {
    if (this.#itemRefs.length === 0) {
      return 0;
    }

    return this.#itemRefs[0].stackOrder + 1;
  }
}
