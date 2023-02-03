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
  OnInit,
  Output,
  QueryList,
  Renderer2,
  SimpleChanges,
} from '@angular/core';

import { DragulaService } from 'ng2-dragula';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyRepeaterAdapterService } from './repeater-adapter.service';
import { SkyRepeaterExpandModeType } from './repeater-expand-mode-type';
import { SkyRepeaterItemRolesType } from './repeater-item-roles.type';
import { SkyRepeaterItemComponent } from './repeater-item.component';
import { SkyRepeaterRoleType } from './repeater-role.type';
import { SkyRepeaterService } from './repeater.service';

/**
 * Creates a container to display repeater items.
 */
@Component({
  selector: 'sky-repeater',
  styleUrls: ['./repeater.component.scss'],
  templateUrl: './repeater.component.html',
  providers: [SkyRepeaterService, SkyRepeaterAdapterService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyRepeaterComponent
  implements AfterContentInit, OnChanges, OnDestroy, OnInit
{
  /**
   * Specifies the index of the repeater item to visually highlight as active.
   * For example, use this property in conjunction with the
   * [split view component](https://developer.blackbaud.com/skyux/components/split-view)
   * to highlight a repeater item while users edit it. Only one item can be active at a time.
   */
  @Input()
  public activeIndex: number | undefined;

  /**
   * Specifies an ARIA label for the repeater list.
   * This sets the repeater list's `aria-label` attribute to provide a text equivalent for screen readers 
   * [to support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   * @default "List of items"
   */
  @Input()
  public ariaLabel: string | undefined;

  /**
   * Indicates whether users can change the order of items in the repeater list.
   * Each repeater item also has `reorderable` property to indicate whether
   * users can change its order.
   */
  @Input()
  public reorderable: boolean | undefined = false;

  /**
   * Specifies a layout to determine which repeater items are expanded by default and whether
   * repeater items are expandable and collapsible. Collapsed items display titles only.
   * The valid options are `multiple`, `none`, and `single`.
   * - `multiple` loads repeater items in an expanded state unless `isExpanded` is set to
   * `false` for a repeater item. This layout allows users to expand and collapse
   * as many repeater items as necessary. It is best-suited to repeater items where body
   * content is important but users don't always need to see it.
   * - `none` loads all repeater items in an expanded state and does not allow users to
   * collapse them. This default layout provides the quickest access to the details in the
   * repeater items. It is best-suited to repeater items with concise content
   * that users need to view frequently.
   * - `single` loads one repeater item in an expanded state and collapses all others.
   * The expanded repeater item is the first one where `isExpanded` is set to `true`. This layout
   * allows users to expand one item at a time. It provides the most compact view and is
   * best-suited to repeater items where the most important information is in the titles
   * and users only occasionally need to view the body content.
   * @default "none"
   */
  // TODO: Remove 'string' as a valid type in a breaking change.
  @Input()
  public set expandMode(value: SkyRepeaterExpandModeType | string | undefined) {
    this.#repeaterService.expandMode = value;
    this.#updateForExpandMode();
  }

  public get expandMode(): SkyRepeaterExpandModeType | string {
    return this.#repeaterService.expandMode;
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
  public items: QueryList<SkyRepeaterItemComponent> | undefined;

  public dragulaGroupName: string;

  public role: SkyRepeaterRoleType | undefined;

  #adapterService: SkyRepeaterAdapterService;
  #changeDetector: ChangeDetectorRef;
  #dragulaService: DragulaService;
  #elementRef: ElementRef;
  #renderer: Renderer2;
  #repeaterService: SkyRepeaterService;
  #ngUnsubscribe = new Subject<void>();

  constructor(
    changeDetector: ChangeDetectorRef,
    repeaterService: SkyRepeaterService,
    adapterService: SkyRepeaterAdapterService,
    dragulaService: DragulaService,
    elementRef: ElementRef,
    renderer: Renderer2
  ) {
    this.#changeDetector = changeDetector;
    this.#repeaterService = repeaterService;
    this.#adapterService = adapterService;
    this.#dragulaService = dragulaService;
    this.#elementRef = elementRef;
    this.#renderer = renderer;

    this.dragulaGroupName = `sky-repeater-dragula-${
      this.#repeaterService.repeaterGroupId
    }`;

    this.#repeaterService.itemCollapseStateChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((item: SkyRepeaterItemComponent) => {
        if (this.expandMode === 'single' && item.isExpanded) {
          this.items?.forEach((otherItem) => {
            if (
              otherItem !== item &&
              otherItem.isExpanded &&
              otherItem.isCollapsible
            ) {
              otherItem.isExpanded = false;
            }
          });
        }
      });

    this.#repeaterService.activeItemIndexChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((index) => {
        if (index !== this.activeIndex) {
          this.activeIndex = index;
          this.activeIndexChange.emit(index);
        }
      });

    this.#repeaterService.orderChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#emitTags();
      });

    this.#updateForExpandMode();

    this.#adapterService.setRepeaterHost(this.#elementRef);

    this.#initializeDragAndDrop();
  }

  public ngAfterContentInit(): void {
    // If activeIndex has been set on init, call service to activate the appropriate item.
    setTimeout(() => {
      if (this.activeIndex || this.activeIndex === 0) {
        this.#repeaterService.activateItemByIndex(this.activeIndex);
      }

      if (this.reorderable && !this.#everyItemHasTag()) {
        console.warn(
          'Please supply tag properties for each repeater item when reordering functionality is enabled.'
        );
      }
    });

    // HACK: Not updating for expand mode in a timeout causes an error.
    // https://github.com/angular/angular/issues/6005
    this.items?.changes.pipe(takeUntil(this.#ngUnsubscribe)).subscribe(() => {
      setTimeout(() => {
        if (this.items?.last) {
          this.#updateForExpandMode(this.items.last);
          this.items.last.reorderable = this.reorderable;
        }

        if (this.activeIndex !== undefined) {
          this.#repeaterService.activateItemByIndex(this.activeIndex);
        }

        this.#updateRole();
      });
    });

    setTimeout(() => {
      this.#updateForExpandMode();

      this.items?.forEach((item) => {
        item.reorderable = this.reorderable;
      });

      this.#updateRole();
    }, 0);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['activeIndex']) {
      this.#repeaterService.enableActiveState = true;
      if (
        changes['activeIndex'].currentValue !==
        changes['activeIndex'].previousValue
      ) {
        this.#repeaterService.activateItemByIndex(this.activeIndex);
      }
    }

    if (changes.reorderable) {
      if (this.items) {
        this.items.forEach((item) => (item.reorderable = this.reorderable));
      }
      this.#updateRole();

      this.#changeDetector.markForCheck();
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    this.#destroyDragAndDrop();
  }

  public ngOnInit(): void {
    this.#updateRole();
  }

  public onCdkObserveContent(): void {
    this.#updateRole();
  }

  #updateForExpandMode(itemAdded?: SkyRepeaterItemComponent): void {
    if (this.items) {
      let foundExpanded = false;
      const isCollapsible = this.expandMode !== 'none';
      const isSingle = this.expandMode === 'single';

      // Keep any newly-added expanded item expanded and collapse the rest.
      if (itemAdded && itemAdded.isExpanded) {
        foundExpanded = true;
      }

      this.items.forEach((item) => {
        item.isCollapsible = isCollapsible && !!item.hasItemContent;

        if (item !== itemAdded && isSingle && item.isExpanded) {
          if (foundExpanded) {
            item.updateForExpanded(false);
          }

          foundExpanded = true;
        }
      });

      this.#updateRole();
    }
  }

  #initializeDragAndDrop(): void {
    /* Sanity check that we haven't already set up dragging abilities */
    /* istanbul ignore else */
    if (!this.#dragulaService.find(this.dragulaGroupName)) {
      this.#dragulaService.createGroup(this.dragulaGroupName, {
        moves: (el, container, handle) => {
          const target = el?.querySelector('.sky-repeater-item-grab-handle');
          return !!this.reorderable && !!target && target.contains(handle!);
        },
      });
    }

    let draggedItemIndex = -1;

    this.#dragulaService
      .drag(this.dragulaGroupName)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((args) => {
        /* istanbul ignore else */
        if (args.name === this.dragulaGroupName) {
          this.#renderer.addClass(args.el, 'sky-repeater-item-dragging');
          draggedItemIndex = this.#adapterService.getRepeaterItemIndex(
            args.el as HTMLElement
          );
        }
      });

    this.#dragulaService
      .dragend(this.dragulaGroupName)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((args) => {
        /* istanbul ignore else */
        if (args.name === this.dragulaGroupName) {
          this.#renderer.removeClass(args.el, 'sky-repeater-item-dragging');
          const newItemIndex = this.#adapterService.getRepeaterItemIndex(
            args.el as HTMLElement
          );

          /* sanity check */
          /* istanbul ignore else */
          if (draggedItemIndex >= 0) {
            this.#repeaterService.reorderItem(draggedItemIndex, newItemIndex);
            draggedItemIndex = -1;
          }

          this.#emitTags();
        }
      });
  }

  #destroyDragAndDrop(): void {
    /* Sanity check that we have set up dragging abilities */
    /* istanbul ignore else */
    if (this.#dragulaService.find(this.dragulaGroupName)) {
      this.#dragulaService.destroy(this.dragulaGroupName);
    }
  }

  #emitTags(): void {
    const tags = this.#repeaterService.items.map((item) => item.tag);
    this.orderChange.emit(tags);
  }

  #everyItemHasTag(): boolean {
    /* sanity check */
    /* istanbul ignore if */
    if (!this.items || this.items.length === 0) {
      return false;
    }
    return this.items.toArray().every((item) => {
      return item.tag !== undefined;
    });
  }

  #updateRole(): void {
    // Determine a role using a hierarchy based on https://www.w3.org/TR/wai-aria-practices-1.1/
    //   1. If there are one or more interactions in the repeater item projected content, use grid.
    //   2. If there are selectable repeater items and no other interactions, use listbox.
    //   3. If there are no interactions, use list.

    // Default to list role.
    let autoRole: SkyRepeaterRoleType = 'list';

    const roleMap: Record<SkyRepeaterRoleType, SkyRepeaterItemRolesType> = {
      list: { item: 'listitem', title: undefined, content: undefined },
      listbox: { item: 'option', title: undefined, content: undefined },
      grid: { item: 'row', title: 'rowheader', content: 'gridcell' },
    };

    // Based on https://html.spec.whatwg.org/multipage/dom.html#interactive-content
    const interactionSelector = [
      'a[href]',
      'audio[controls]',
      'button',
      'details',
      'embed',
      'iframe',
      'img[usemap]',
      'input:not([type="hidden"])',
      'label',
      'select',
      'textarea',
      'video[controls]',
      '[contenteditable]',
      '.sky-repeater[role="grid"]',
    ]
      .map(
        (selector) =>
          `sky-repeater-item-title ${selector}:not([hidden]), sky-repeater-item-content ${selector}:not([hidden])`
      )
      .concat([`skyux-dropdown`])
      .join(', ');

    const hasInteraction =
      this.reorderable ||
      this.items?.some((item) => item.isCollapsible) ||
      this.items?.some((item) => !!item.selectable) ||
      !!(this.#elementRef.nativeElement as HTMLElement).querySelector(
        interactionSelector
      );

    if (hasInteraction) {
      // If the repeater matches interaction selector https://www.w3.org/TR/wai-aria-practices-1.1/#grid
      autoRole = 'grid';
    }

    if (this.role !== autoRole) {
      this.#repeaterService.itemRole.next({
        ...roleMap[autoRole],
      });
      this.role = `${autoRole}`;
      this.#changeDetector.markForCheck();
    }
  }
}
