import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  Injector,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef
} from '@angular/core';

import {
  SkyDockDomAdapterService
} from './dock-dom-adapter.service';

import {
  SkyDockItemConfig
} from './dock-item-config';

import {
  SkyDockItemReference
} from './dock-item-reference';

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
export class SkyDockComponent implements OnInit {

  /**
   * Use `any` for backwards-compatibility with Angular 4-7.
   * See: https://github.com/angular/angular/issues/30654
   */
  @ViewChild('target', {
    read: ViewContainerRef,
    static: true
  } as any)
  private target: ViewContainerRef;

  private itemRefs: SkyDockItemReference<any>[] = [];

  constructor(
    private changeDetector: ChangeDetectorRef,
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef,
    private injector: Injector,
    private domAdapter: SkyDockDomAdapterService
  ) { }

  public ngOnInit(): void {
    this.domAdapter.watchDomChanges(this.elementRef);
  }

  public insertComponent<T>(
    component: Type<T>,
    config: SkyDockItemConfig = {}
  ): SkyDockItemReference<T> {

    const factory = this.resolver.resolveComponentFactory(component);
    const injector = Injector.create({
      providers: config.providers || [],
      parent: this.injector
    });

    const componentRef = this.target.createComponent(factory, undefined, injector);
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

  private sortItemsByStackOrder(): void {
    this.itemRefs.sort(sortByStackOrder);

    // Detach all views so we can assign new indexes without overwriting their placement.
    for (let i = 0, len = this.target.length; i < len; i++) {
      this.target.detach(i);
    }

    // Reassign the correct index for each view.
    this.itemRefs.forEach((item, i) => this.target.insert(item.componentRef.hostView, i));
  }

  private getHighestStackOrder(): number {
    if (this.itemRefs.length === 0) {
      return 0;
    }

    return this.itemRefs[0].stackOrder + 1;
  }

}
