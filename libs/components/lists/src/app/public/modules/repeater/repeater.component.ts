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
} from 'ng2-dragula/ng2-dragula';

import {
  Subject
} from 'rxjs/Subject';

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

@Component({
  selector: 'sky-repeater',
  styleUrls: ['./repeater.component.scss'],
  templateUrl: './repeater.component.html',
  providers: [SkyRepeaterService, SkyRepeaterAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyRepeaterComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Input()
  public activeIndex: number;

  @Input()
  public reorderable: boolean = false;

  @Input()
  public set expandMode(value: string) {
    this.repeaterService.expandMode = value;
    this._expandMode = value;
    this.updateForExpandMode();
  }

  public get expandMode(): string {
    return this._expandMode || 'none';
  }

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
      .takeUntil(this.ngUnsubscribe)
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
      .takeUntil(this.ngUnsubscribe)
      .subscribe((index: number) => {
        if (index !== this.activeIndex) {
          this.activeIndex = index;
          this.activeIndexChange.emit(index);
        }
      });

    this.repeaterService.orderChange
      .takeUntil(this.ngUnsubscribe)
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
      .takeUntil(this.ngUnsubscribe)
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

    // Make the first item tabbable.
    if (this.items.length > 0) {
      setTimeout(() => {
        this.items.first.tabIndex = 0;
      });
    }
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
    this.dragulaService.setOptions(this.dragulaGroupName, {
      moves: (el: HTMLElement, container: HTMLElement, handle: HTMLElement) => {
        const target = el.querySelector('.sky-repeater-item-grab-handle');
        return (target && target.contains(handle));
      }
    });

    // Reset the current dragula subscriptions.
    this.dragulaUnsubscribe.next();
    this.dragulaUnsubscribe.complete();
    this.dragulaUnsubscribe = new Subject<void>();

    let draggedItemIndex: number;

    this.dragulaService.drag
      .takeUntil(this.dragulaUnsubscribe)
      .subscribe(([groupName, subject]: any[]) => {
        /* istanbul ignore else */
        if (groupName === this.dragulaGroupName) {
          this.renderer.addClass(subject, 'sky-repeater-item-dragging');
          draggedItemIndex = this.adapterService.getRepeaterItemIndex(subject);
        }
      });

    this.dragulaService.dragend
      .takeUntil(this.dragulaUnsubscribe)
      .subscribe(([groupName, subject]: any[]) => {
        /* istanbul ignore else */
        if (groupName === this.dragulaGroupName) {
          this.renderer.removeClass(subject, 'sky-repeater-item-dragging');
          let newItemIndex = this.adapterService.getRepeaterItemIndex(subject);

          /* sanity check */
          /* istanbul ignore else */
          if (draggedItemIndex) {
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
