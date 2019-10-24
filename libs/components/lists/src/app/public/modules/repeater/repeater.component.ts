import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  QueryList,
  OnChanges,
  OnDestroy,
  Output,
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

@Component({
  selector: 'sky-repeater',
  styleUrls: ['./repeater.component.scss'],
  templateUrl: './repeater.component.html',
  providers: [SkyRepeaterService, SkyRepeaterAdapterService],
  viewProviders: [DragulaService]
})
export class SkyRepeaterComponent implements AfterContentInit, OnChanges, OnDestroy {

  @Input()
  public activeIndex: number;

  @Input()
  public set reorderable(isReorderable: boolean) {
    this._reorderable = isReorderable;

    if (this.items) {
      this.items.forEach(item => {
        item.reorderable = isReorderable;
      });
    }
  }

  public get reorderable() {
    return this._reorderable;
  }

  @Input()
  public set expandMode(value: string) {
    this._expandMode = value;
    this.updateForExpandMode();
  }

  public get expandMode(): string {
    return this._expandMode || 'none';
  }

  @Output()
  public activeIndexChange = new EventEmitter<number>();

  @ContentChildren(SkyRepeaterItemComponent)
  public items: QueryList<SkyRepeaterItemComponent>;

  private ngUnsubscribe = new Subject<void>();

  private _reorderable = false;

  private _expandMode = 'none';

  constructor(
    private repeaterService: SkyRepeaterService,
    private adapterService: SkyRepeaterAdapterService,
    private dragulaService: DragulaService,
    private elementRef: ElementRef
  ) {
    this.repeaterService.itemCollapseStateChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((item: SkyRepeaterItemComponent) => {
        if (this.expandMode === 'single' && item.isExpanded) {
          this.items.forEach((otherItem) => {
            if (otherItem !== item && otherItem.isExpanded) {
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

    this.updateForExpandMode();

    this.adapterService.setRepeaterHost(this.elementRef);
  }

  public ngAfterContentInit(): void {
    // If activeIndex has been set on init, call service to activate the appropriate item.
    setTimeout(() => {
      if (this.activeIndex || this.activeIndex === 0) {
        this.repeaterService.activateItemByIndex(this.activeIndex);
      }
    });

    // HACK: Not updating for expand mode in a timeout causes an error.
    // https://github.com/angular/angular/issues/6005
    this.items.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        setTimeout(() => {
          this.updateForExpandMode(this.items.last);
        }, 0);
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

    // Setup item reorder drag-and-drop.
    this.initializeDragAndDrop();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeIndex']) {
      this.repeaterService.enableActiveState = true;
      if (changes['activeIndex'].currentValue !== changes['activeIndex'].previousValue) {
        this.repeaterService.activateItemByIndex(this.activeIndex);
      }
    }
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public getItemsFromService(): SkyRepeaterItemComponent[] {
    return this.repeaterService.items;
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
        item.isCollapsible = isCollapsible;

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
    this.dragulaService
      .drag
      .takeUntil(this.ngUnsubscribe)
      .subscribe(([, source]: Array<HTMLElement>) =>
        source.classList.add('sky-repeater-item-dragging')
      );

    this.dragulaService
      .dragend
      .takeUntil(this.ngUnsubscribe)
      .subscribe(([, source]: Array<HTMLElement>) =>
        source.classList.remove('sky-repeater-item-dragging')
      );

    this.dragulaService.setOptions('sky-repeater', {
      moves: (el: HTMLElement, container: HTMLElement, handle: HTMLElement) => {
        const target = el.querySelector('.sky-repeater-item-grab-handle');
        return target && target.contains(handle);
      }
    });
  }
}
