import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges
} from '@angular/core';

import {
  DragulaService
} from 'ng2-dragula';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  SkyRepeaterItemComponent
} from './repeater-item.component';

import {
  SkyRepeaterService
} from './repeater.service';

import {
  SkyRepeaterAdapterService
} from './repeater-adapter.service';

let uniqueId = 0;

/**
 * Creates a container to display repeater items.
 */
@Component({
  selector: 'sky-repeater',
  styleUrls: ['./repeater.component.scss'],
  templateUrl: './repeater.component.html',
  providers: [SkyRepeaterService, SkyRepeaterAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyRepeaterComponent implements AfterContentInit, OnChanges, OnDestroy {

  /**
   * Specifies the index of the repeater item to visually highlight as active.
   * For example, use this property in conjunction with the
   * [split view component](https://developer.blackbaud.com/skyux/components/split-view)
   * to highlight a repeater item while users edit it. Only one item can be active at a time.
   */
  @Input()
  public activeIndex: number;

  /**
   * Defines a string value to label the repeater list for accessibility.
   * @default 'List of items'
   */
  @Input()
  public ariaLabel: string;

  /**
   * Indicates whether users can change the order of items in the repeater list.
   * Each repeater item also has `reorderable` property to indicate whether
   * users can change its order.
   */
  @Input()
  public reorderable: boolean = false;

  /**
   * Specifies a layout for the repeater list to indicate whether users can collapse
   * and expand repeater items. Items in a collapsed state display titles only.
   * The valid options are `multiple`, `none`, and `single`.
   * - `multiple` loads all repeater items in a collapsed state and allows users to expand
   * and collapse them.This layout provides a more compact view but still allows users to expand
   * as many repeater items as necessary. It is best-suited to repeater items where the most
   * important information is in the titles and users only occasionally need to view body content.
   * - `none` loads all repeater items in an expanded state and does not allow users to
   * collapse them. This standard layout provides the quickest access to the details in the
   * repeater items. It is best-suited to repeater items with concise content
   * that users need to view frequently.
   * - `single` loads all repeater items in a collapsed state and allows users to expand
   * one item at a time. This layout provides the most compact view because users can only
   * expand one repeater item at a time. It is best-suited to repeater items where the most
   * important information is in the titles and users only occasionally need to view
   * the body content of one repeater item at a time.
   * @default none
   */
  @Input()
  public set expandMode(value: string) {
    this.repeaterService.expandMode = value;
    this._expandMode = value;
    this.updateForExpandMode();
  }

  public get expandMode(): string {
    return this._expandMode || 'none';
  }

  /**
   * Fires when the active repeater item changes.
   */
  @Output()
  public activeIndexChange = new EventEmitter<number>();

  /**
   * Fires when users change the order of repeater items.
   * This event emits an ordered array of the `tag` properties that the consumer provides for each repeater item.
   */
  @Output()
  public orderChange = new EventEmitter<any[]>();

  @ContentChildren(SkyRepeaterItemComponent)
  public items: QueryList<SkyRepeaterItemComponent>;

  public dragulaGroupName: string;

  private dragulaUnsubscribe = new Subject<void>();

  private ngUnsubscribe = new Subject<void>();

  private _expandMode = 'none';

  constructor(
    private changeDetector: ChangeDetectorRef,
    private repeaterService: SkyRepeaterService,
    private adapterService: SkyRepeaterAdapterService,
    private dragulaService: DragulaService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.dragulaGroupName = `sky-repeater-dragula-${++uniqueId}`;

    this.repeaterService.itemCollapseStateChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((item: SkyRepeaterItemComponent) => {
        if (this.expandMode === 'single' && item.isExpanded) {
          this.items.forEach((otherItem) => {
            if (otherItem !== item && otherItem.isExpanded && otherItem.isCollapsible) {
              otherItem.isExpanded = false;
            }
          });
        }
      });

    this.repeaterService.activeItemIndexChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((index: number) => {
        if (index !== this.activeIndex) {
          this.activeIndex = index;
          this.activeIndexChange.emit(index);
        }
      });

    this.repeaterService.orderChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.emitTags();
      });

    this.updateForExpandMode();

    this.adapterService.setRepeaterHost(this.elementRef);
  }

  public ngAfterContentInit(): void {
    // If activeIndex has been set on init, call service to activate the appropriate item.
    setTimeout(() => {
      if (this.activeIndex || this.activeIndex === 0) {
        this.repeaterService.activateItemByIndex(this.activeIndex);
      }

      if (this.reorderable && !this.everyItemHasTag()) {
        console.warn('Please supply tag properties for each repeater item when reordering functionality is enabled.');
      }
    });

    // HACK: Not updating for expand mode in a timeout causes an error.
    // https://github.com/angular/angular/issues/6005
    this.items.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        setTimeout(() => {
          if (!!this.items.last) {
            this.updateForExpandMode(this.items.last);
            this.items.last.reorderable = this.reorderable;
          }

          if (this.activeIndex !== undefined) {
            this.repeaterService.activateItemByIndex(this.activeIndex);
          }
        });
      });

    setTimeout(() => {
      this.updateForExpandMode();

      this.items.forEach(item => {
        item.reorderable = this.reorderable;
      });
    }, 0);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeIndex']) {
      this.repeaterService.enableActiveState = true;
      if (changes['activeIndex'].currentValue !== changes['activeIndex'].previousValue) {
        this.repeaterService.activateItemByIndex(this.activeIndex);
      }
    }

    if (changes.reorderable) {
      if (this.items) {
        this.items.forEach(item => item.reorderable = this.reorderable);
      }

      if (this.reorderable) {
        this.initializeDragAndDrop();
      }

      this.changeDetector.markForCheck();
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.destroyDragAndDrop();
  }

  private updateForExpandMode(itemAdded?: SkyRepeaterItemComponent): void {
    if (this.items) {
      let foundExpanded = false;
      let isCollapsible = this.expandMode !== 'none';
      let isSingle = this.expandMode === 'single';

      // Keep any newly-added expanded item expanded and collapse the rest.
      if (itemAdded && itemAdded.isExpanded) {
        foundExpanded = true;
      }

      this.items.forEach((item) => {
        item.isCollapsible = isCollapsible && !!item.hasItemContent;

        if (item !== itemAdded && isSingle && item.isExpanded) {
          if (foundExpanded) {
            item.updateForExpanded(false, false);
          }

          foundExpanded = true;
        }
      });
    }
  }

  private initializeDragAndDrop(): void {
    if (!this.dragulaService.find(this.dragulaGroupName)) {
      this.dragulaService.setOptions(this.dragulaGroupName, {
        moves: (el: HTMLElement, container: HTMLElement, handle: HTMLElement) => {
          const target = el.querySelector('.sky-repeater-item-grab-handle');
          return (target && target.contains(handle));
        }
      });
    }

    // Reset the current dragula subscriptions.
    this.dragulaUnsubscribe.next();
    this.dragulaUnsubscribe.complete();
    this.dragulaUnsubscribe = new Subject<void>();

    let draggedItemIndex: number;

    this.dragulaService.drag
      .pipe(takeUntil(this.dragulaUnsubscribe))
      .subscribe(([groupName, subject]: any[]) => {
        /* istanbul ignore else */
        if (groupName === this.dragulaGroupName) {
          this.renderer.addClass(subject, 'sky-repeater-item-dragging');
          draggedItemIndex = this.adapterService.getRepeaterItemIndex(subject);
        }
      });

    this.dragulaService.dragend
      .pipe(takeUntil(this.dragulaUnsubscribe))
      .subscribe(([groupName, subject]: any[]) => {
        /* istanbul ignore else */
        if (groupName === this.dragulaGroupName) {
          this.renderer.removeClass(subject, 'sky-repeater-item-dragging');
          let newItemIndex = this.adapterService.getRepeaterItemIndex(subject);

          /* sanity check */
          /* istanbul ignore else */
          if (draggedItemIndex >= 0) {
            this.repeaterService.reorderItem(draggedItemIndex, newItemIndex);
            draggedItemIndex = undefined;
          }

          this.emitTags();
        }
      });
  }

  private destroyDragAndDrop(): void {
    this.dragulaUnsubscribe.next();
    this.dragulaUnsubscribe.complete();
    this.dragulaUnsubscribe = undefined;

    if (this.dragulaService.find(this.dragulaGroupName)) {
      this.dragulaService.destroy(this.dragulaGroupName);
    }
  }

  private emitTags(): void {
    const tags = this.repeaterService.items.map(item => item.tag);
    this.orderChange.emit(tags);
  }

  private everyItemHasTag(): boolean {
    /* sanity check */
    /* istanbul ignore if */
    if (!this.items || this.items.length === 0) {
      return false;
    }
    return this.items.toArray().every(item => {
      return item.tag !== undefined;
    });
  }
}
