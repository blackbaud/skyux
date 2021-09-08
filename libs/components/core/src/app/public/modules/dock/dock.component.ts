import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  SkyDockDomAdapterService
} from './dock-dom-adapter.service';

import {
  SkyDockInsertComponentConfig
} from './dock-insert-component-config';

import {
  SkyDockItemReference
} from './dock-item-reference';

import {
  SkyDockLocation
} from './dock-location';

import {
  SkyDockOptions
} from './dock-options';

import {
  sortByStackOrder
} from './sort-by-stack-order';

/**
 * @internal
 */
@Component({
  selector: 'sky-dock',
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  providers: [
    SkyDockDomAdapterService
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyDockComponent  {

  private options: SkyDockOptions;

  @ViewChild('target', {
    read: ViewContainerRef,
    static: true
  })
  private target: ViewContainerRef;

  private itemRefs: SkyDockItemReference<any>[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
    private injector: Injector,
    private domAdapter: SkyDockDomAdapterService
  ) { }

  public insertComponent<T>(
    component: Type<T>,
    config: SkyDockInsertComponentConfig = {}
  ): SkyDockItemReference<T> {
    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({
      providers: config.providers || [],
      parent: this.injector
    });

    const componentRef = this.target.createComponent<T>(factory, undefined, injector);
    const stackOrder = (config.stackOrder !== null && config.stackOrder !== undefined)
      ? config.stackOrder
      : this.getHighestStackOrder();

    this.itemRefs.push({
      componentRef,
      stackOrder
    });

    this.sortItemsByStackOrder();

    this.changeDetector.markForCheck();

    return {
      componentRef,
      stackOrder
    };
  }

  public removeItem(item: SkyDockItemReference<any>): void {
    const viewRef = item.componentRef.hostView;
    this.target.remove(this.target.indexOf(viewRef));

    const found = this.itemRefs.find(i => i.componentRef.hostView === viewRef);
    this.itemRefs.splice(this.itemRefs.indexOf(found), 1);
  }

  public setOptions(options: SkyDockOptions): void {
    this.options = options;

    if (this.options?.location === SkyDockLocation.BeforeElement) {
      this.domAdapter.unbindDock(this.elementRef);
    }

    if (this.options?.zIndex) {
      this.domAdapter.setZIndex(this.options.zIndex, this.elementRef);
    }
  }

  private sortItemsByStackOrder(): void {
    this.itemRefs.sort(sortByStackOrder);

    // Reassign the correct index for each view.
    this.itemRefs.forEach((item, i) => this.target.move(item.componentRef.hostView, i));
  }

  private getHighestStackOrder(): number {
    if (this.itemRefs.length === 0) {
      return 0;
    }

    return this.itemRefs[0].stackOrder + 1;
  }

}
