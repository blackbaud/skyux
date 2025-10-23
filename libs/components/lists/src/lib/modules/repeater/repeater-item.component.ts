import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { skyAnimationSlide } from '@skyux/animations';
import { SkyContentInfoProvider, SkyIdService } from '@skyux/core';
import { SkyCheckboxChange } from '@skyux/forms';
import { SkyLibResourcesService } from '@skyux/i18n';
import {
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';

import { Observable, Subject, forkJoin as observableForkJoin } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyRepeaterAdapterService } from './repeater-adapter.service';
import { SkyRepeaterItemContentComponent } from './repeater-item-content.component';
import { SkyRepeaterItemContextMenuComponent } from './repeater-item-context-menu.component';
import { SkyRepeaterItemRolesType } from './repeater-item-roles.type';
import { SkyRepeaterItemTitleComponent } from './repeater-item-title.component';
import { SkyRepeaterService } from './repeater.service';

let nextContentId = 0;

/**
 * Creates an individual repeater item.
 */
@Component({
  selector: 'sky-repeater-item',
  styleUrls: ['./repeater-item.component.scss'],
  templateUrl: './repeater-item.component.html',
  animations: [skyAnimationSlide],
  providers: [SkyContentInfoProvider],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyRepeaterItemComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  /**
   * Make the first, non-disabled item tab-focusable in a selectable repeater.
   * - Disabled items should not be focusable per [W3C](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_disabled_controls).
   * - One item per list/grid/listbox should be tab focusable per [W3C](https://www.w3.org/TR/wai-aria-practices-1.1/#grid).
   */
  public get tabindex(): 0 | -1 {
    return this.#repeaterService.items.filter((item) => !item.disabled)[0] ===
      this && this.selectable
      ? 0
      : -1;
  }
  /**
   * Whether to disable a selectable repeater item.
   */
  @Input()
  public set disabled(value: boolean | undefined) {
    if (this.#_isDisabled !== value) {
      if (value) {
        this.isSelected = false;
        this.#_isDisabled = true;
      } else {
        this.#_isDisabled = false;
      }
      if (this.isActive) {
        this.#repeaterService.activateItemByIndex(undefined);
      }
      if (this.#elementRef.nativeElement.matches(':focus-within')) {
        this.#elementRef.nativeElement.ownerDocument.activeElement.blur();
      }
      this.#changeDetector.markForCheck();
    }
  }
  public get disabled(): boolean | undefined {
    return this.#_isDisabled;
  }

  /**
   * The human-readable name for the repeater item that is available for multiple purposes,
   * such as accessibility and instrumentation. For example, the component uses the name to
   * construct ARIA labels for the repeater item controls
   * to [support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   * If not specified, the repeater item's title will be used for this value.
   * For more information about the `aria-label` attribute, see the [WAI-ARIA definition](https://www.w3.org/TR/wai-aria/#aria-label).
   */
  @Input()
  public set itemName(value: string | undefined) {
    this.#_itemName = value;
    this.#updateContentInfo();
  }

  public get itemName(): string | undefined {
    return this.#_itemName;
  }

  /**
   * Configuration options for the buttons to display on an inline form
   * within the repeater. This property accepts
   * [a `SkyInlineFormConfig` object](https://developer.blackbaud.com/skyux/components/inline-form#skyinlineformconfig-properties).
   */
  @Input()
  public inlineFormConfig: SkyInlineFormConfig | undefined;

  /**
   * Specifies [an Angular `TemplateRef`](https://angular.dev/api/core/TemplateRef) to use
   * as a template to instantiate an inline form within the repeater.
   */
  @Input()
  public inlineFormTemplate: TemplateRef<unknown> | undefined;

  /**
   * Whether the repeater item is expanded.
   * @default true
   */
  @Input()
  public set isExpanded(value: boolean | undefined) {
    this.updateForExpanded(value !== false, true);
  }

  public get isExpanded(): boolean {
    return this.#isExpanded;
  }

  /**
   * Whether the repeater item's checkbox is selected.
   * When users select the repeater item, the specified property on your model is updated accordingly.
   * @default false
   */
  @Input()
  public set isSelected(value: boolean | undefined) {
    if (!this.disabled && value !== this.#_isSelected) {
      this.#_isSelected = value;
      this.isSelectedChange.emit(this.#_isSelected);
    }
  }

  public get isSelected(): boolean | undefined {
    return this.#_isSelected;
  }

  /**
   * Whether users can change the order of the repeater item.
   * The repeater component's `reorderable` property must also be set to `true`.
   * @internal
   */
  @Input()
  public reorderable: boolean | undefined = false;

  /**
   * Whether to display a checkbox in the left of the repeater item.
   */
  @Input()
  public selectable: boolean | undefined = false;

  /**
   * Whether to display an inline form within the repeater.
   * Users can toggle between displaying and hiding the inline form.
   */
  @Input()
  public showInlineForm: boolean | undefined = false;

  /**
   * The object that the repeater component returns for this repeater item
   * when the `orderChange` event fires. This is required
   * if you set the `reorderable` property to `true`.
   */
  @Input()
  public tag: any;

  /**
   * Fires when users collapse the repeater item.
   */
  @Output()
  public collapse = new EventEmitter<void>();

  /**
   * Fires when users expand the repeater item.
   */
  @Output()
  public expand = new EventEmitter<void>();

  /**
   * Fires when the repeater includes an inline form and users close it. This event emits
   * [a `SkyInlineFormCloseArgs` type](https://developer.blackbaud.com/skyux/components/inline-form#skyinlineformcloseargs-properties).
   */
  @Output()
  public inlineFormClose = new EventEmitter<SkyInlineFormCloseArgs>();

  /**
   * Fires when users select or clear the checkbox for the repeater item.
   */
  @Output()
  public isSelectedChange = new EventEmitter<boolean>();

  @ContentChild(SkyRepeaterItemContextMenuComponent, { read: ElementRef })
  public contextMenu: ElementRef | undefined;

  public contentId: string;

  public hasItemContent = false;

  public isActive = false;

  public set isCollapsible(value: boolean | undefined) {
    if (this.isCollapsible !== value) {
      this.#_isCollapsible = value !== false;

      /*istanbul ignore else */
      if (!this.#_isCollapsible) {
        this.updateForExpanded(true, true);
      }
    }

    this.#changeDetector.markForCheck();
  }

  public get isCollapsible(): boolean {
    return this.#_isCollapsible;
  }

  public itemRole$: Observable<SkyRepeaterItemRolesType>;

  public reorderButtonLabel = '';

  public reorderState: string | undefined;

  public slideDirection: string | undefined;

  public animationDisabled = false;

  @HostBinding('class')
  public get repeaterGroupClass(): string {
    return 'sky-repeater-item-group-' + this.#repeaterService.repeaterGroupId;
  }

  @ViewChild('grabHandle', { read: ElementRef })
  public grabHandle: ElementRef | undefined;

  @ViewChild('itemContentRef', { read: ElementRef })
  public itemContentRef: ElementRef | undefined;

  @ViewChild('itemHeaderRef', { read: ElementRef })
  public itemHeaderRef: ElementRef | undefined;

  @ViewChild('itemRef', { read: ElementRef })
  public itemRef: ElementRef | undefined;

  @ContentChild(SkyRepeaterItemTitleComponent, { read: ElementRef })
  public set titleComponent(value: ElementRef | undefined) {
    this.#titleComponent = value;
    this.#updateContentInfo();
  }

  @ContentChildren(SkyRepeaterItemContentComponent)
  public repeaterItemContentComponents:
    | QueryList<SkyRepeaterItemContentComponent>
    | undefined;

  protected titleId: string | undefined;

  #adapterService: SkyRepeaterAdapterService;
  #changeDetector: ChangeDetectorRef;
  #contentInfoProvider = inject(SkyContentInfoProvider);
  #elementRef: ElementRef;
  #isExpanded = true;
  #keyboardReorderingEnabled = false;
  #ngUnsubscribe = new Subject<void>();
  #reorderCancelText = '';
  #reorderCurrentIndex = -1;
  #reorderFinishText = '';
  #reorderInstructions = '';
  #reorderMovedText = '';
  #reorderStateDescription = '';
  #reorderSteps = 0;
  #repeaterService: SkyRepeaterService;
  #resourceService: SkyLibResourcesService;
  #titleComponent: ElementRef | undefined;
  #_isCollapsible = true;
  #_isDisabled: boolean | undefined = false;
  #_isSelected: boolean | undefined;
  #_itemName: string | undefined;

  readonly #idSvc = inject(SkyIdService);

  constructor(
    repeaterService: SkyRepeaterService,
    changeDetector: ChangeDetectorRef,
    adapterService: SkyRepeaterAdapterService,
    elementRef: ElementRef,
    resourceService: SkyLibResourcesService,
  ) {
    this.#repeaterService = repeaterService;
    this.#changeDetector = changeDetector;
    this.#adapterService = adapterService;
    this.#elementRef = elementRef;
    this.#resourceService = resourceService;

    this.#slideForExpanded(false);

    observableForkJoin([
      this.#resourceService.getString('skyux_repeater_item_reorder_cancel'),
      this.#resourceService.getString('skyux_repeater_item_reorder_finish'),
      this.#resourceService.getString(
        'skyux_repeater_item_reorder_instructions',
      ),
      this.#resourceService.getString('skyux_repeater_item_reorder_operation'),
      this.#resourceService.getString('skyux_repeater_item_reorder_moved'),
    ])
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(
        ([
          reorderCancelText,
          reorderFinishText,
          reorderInstructionsText,
          reorderOperationText,
          reorderMovedText,
        ]) => {
          this.#reorderCancelText = reorderCancelText;
          this.#reorderFinishText = reorderFinishText;
          this.#reorderStateDescription = reorderInstructionsText;
          this.#reorderInstructions = reorderOperationText;
          this.#reorderMovedText = reorderMovedText;
          this.reorderButtonLabel = this.#reorderInstructions;
        },
      );
    this.contentId = `sky-repeater-item-content-${++nextContentId}`;
    this.itemRole$ = this.#repeaterService.itemRole.asObservable();
  }

  public ngOnInit(): void {
    this.#repeaterService.registerItem(this);
    this.#repeaterService.activeItemChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((item) => {
        const newIsActiveValue = this === item;
        if (newIsActiveValue !== this.isActive) {
          this.isActive = newIsActiveValue;
          this.#changeDetector.markForCheck();
        }
      });
  }

  public ngAfterViewInit(): void {
    this.hasItemContent = !!this.repeaterItemContentComponents?.length;
    this.#updateExpandOnContentChange();
  }

  public ngOnDestroy(): void {
    this.collapse.complete();
    this.expand.complete();
    this.inlineFormClose.complete();
    this.isSelectedChange.complete();

    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();

    this.#repeaterService.unregisterItem(this);
  }

  @HostListener('keydown', ['$event'])
  public onKeydown($event: KeyboardEvent): void {
    if (
      [' ', 'Enter', 'Home', 'End', 'ArrowUp', 'ArrowDown'].includes($event.key)
    ) {
      if (
        ($event.target as HTMLElement).matches(
          'input, textarea, select, option, [contenteditable], [contenteditable] *',
        )
      ) {
        return;
      }
      $event.preventDefault();
      $event.stopPropagation();
      let activateItem: SkyRepeaterItemComponent | undefined = undefined;
      /* istanbul ignore else */
      if ([' ', 'Enter'].includes($event.key)) {
        if (this.selectable) {
          this.isSelected = !this.isSelected;
        }
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        activateItem = this;
      }
      /* istanbul ignore else */
      if (['Home', 'End'].includes($event.key)) {
        const items = this.#repeaterService.items.filter(
          (item) => !item.disabled,
        );
        if ($event.key === 'Home') {
          activateItem = items.shift();
        } else {
          activateItem = items.pop();
        }
      }
      /* istanbul ignore else */
      if (['ArrowUp', 'ArrowDown'].includes($event.key)) {
        const currentIndex = this.#repeaterService.items.findIndex(
          (item) => item === this,
        );
        let sliceFrom: number;
        let sliceTo: number | undefined;
        if ($event.key === 'ArrowUp') {
          sliceFrom = 0;
          sliceTo = currentIndex;
        } else {
          sliceFrom = currentIndex + 1;
          sliceTo = undefined;
        }
        const items = this.#repeaterService.items
          .slice(sliceFrom, sliceTo)
          .filter((item) => !item.disabled);
        activateItem = $event.key === 'ArrowUp' ? items.pop() : items.shift();
        if (!activateItem) {
          // Wrap around.
          if ($event.key === 'ArrowDown') {
            sliceFrom = 0;
            sliceTo = currentIndex;
          } else {
            sliceFrom = currentIndex + 1;
            sliceTo = undefined;
          }
          const items = this.#repeaterService.items
            .slice(sliceFrom, sliceTo)
            .filter((item) => !item.disabled);
          activateItem = $event.key === 'ArrowUp' ? items.pop() : items.shift();
        }
      }
      /* istanbul ignore else */
      if (activateItem && !activateItem.isActive) {
        this.#repeaterService.activateItem(activateItem);
        if (
          !(activateItem.#elementRef.nativeElement as Element).matches(
            ':focus-within',
          )
        ) {
          activateItem.itemRef?.nativeElement.focus();
        }
      }
    }
  }

  public headerClick(): void {
    if (this.isCollapsible) {
      this.updateForExpanded(!this.isExpanded, true);
    }
  }

  public chevronDirectionChange(direction: string): void {
    this.updateForExpanded(direction === 'up', true);
  }

  public onRepeaterItemClick(event: MouseEvent): void {
    // Only activate item if clicking on the title, content, or parent item div.
    // This will avoid accidental activations when clicking inside interactive elements like
    // the expand/collapse chevron, dropdown, inline-delete, etc...
    if (
      event.target === this.itemRef?.nativeElement ||
      this.itemContentRef?.nativeElement.contains(event.target) ||
      this.itemHeaderRef?.nativeElement.contains(event.target)
    ) {
      this.#repeaterService.activateItem(this);
    }
  }

  public updateForExpanded(value: boolean, animate: boolean): void {
    if (this.isCollapsible === false && value === false) {
      console.warn(
        `Setting isExpanded to false when the repeater item is not collapsible
        will have no effect.`,
      );
    } else if (this.#isExpanded !== value) {
      this.#isExpanded = value;

      if (this.#isExpanded) {
        this.expand.emit();
      } else {
        this.collapse.emit();
      }

      this.#repeaterService.onItemCollapseStateChange(this);
      this.#slideForExpanded(animate);
      this.#changeDetector.markForCheck();
    }
  }

  public onCheckboxChange(value: SkyCheckboxChange): void {
    this.isSelected = value.checked;
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormClose.emit(inlineFormCloseArgs);
  }

  public moveToTop(event: Event): void {
    event.stopPropagation();
    this.#adapterService.moveItemUp(this.#elementRef.nativeElement, true);
    this.#adapterService.focusElement(event.target as HTMLElement);
    this.#repeaterService.registerOrderChange();
  }

  public onReorderHandleKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          this.#keyboardToggleReorder();
          event.preventDefault();
          event.stopPropagation();
          break;

        case 'escape':
          /* istanbul ignore else */
          if (this.#keyboardReorderingEnabled) {
            this.#keyboardReorderingEnabled = false;
            this.#revertReorderSteps();
            this.reorderButtonLabel =
              this.#reorderCancelText + ' ' + this.#reorderInstructions;
            this.#adapterService.focusElement(event.target as HTMLElement);
            event.preventDefault();
            event.stopPropagation();
          }
          break;

        case 'arrowup':
          if (this.#keyboardReorderingEnabled) {
            this.#keyboardReorderUp();
            event.preventDefault();
            event.stopPropagation();
            this.#repeaterService.registerOrderChange();
          }
          break;

        case 'arrowdown':
          /* istanbul ignore else */
          if (this.#keyboardReorderingEnabled) {
            this.#keyboardReorderDown();
            event.preventDefault();
            event.stopPropagation();
            this.#repeaterService.registerOrderChange();
          }
          break;

        case 'arrowleft':
        case 'arrowright':
          /* istanbul ignore else */
          if (this.#keyboardReorderingEnabled) {
            event.preventDefault();
            event.stopPropagation();
          }
          break;

        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  public onReorderHandleBlur(event: any): void {
    this.#keyboardReorderingEnabled = false;
    this.#revertReorderSteps();
    this.reorderButtonLabel = this.#reorderInstructions;
    this.reorderState = undefined;
  }

  #slideForExpanded(animate: boolean): void {
    this.animationDisabled = !animate;
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }

  #keyboardReorderUp(): void {
    const newIndex = this.#adapterService.moveItemUp(
      this.#elementRef.nativeElement,
    );
    if (newIndex !== undefined) {
      this.#reorderCurrentIndex = newIndex;
      this.#reorderSteps--;
      this.#adapterService.focusElement(this.grabHandle);
      this.#keyboardReorderingEnabled = true;
      this.reorderButtonLabel = `${this.#reorderMovedText} ${
        this.#reorderCurrentIndex + 1
      }`;
    }
  }

  #keyboardReorderDown(): void {
    const newIndex = this.#adapterService.moveItemDown(
      this.#elementRef.nativeElement,
    );
    if (newIndex) {
      this.#reorderCurrentIndex = newIndex;
      this.#reorderSteps++;
      this.#adapterService.focusElement(this.grabHandle);
      this.#keyboardReorderingEnabled = true;
      this.reorderButtonLabel = `${this.#reorderMovedText} ${
        this.#reorderCurrentIndex + 1
      }`;
    }
  }

  #keyboardToggleReorder(): void {
    this.#keyboardReorderingEnabled = !this.#keyboardReorderingEnabled;
    this.#reorderSteps = 0;

    if (this.#keyboardReorderingEnabled) {
      this.reorderState = this.#reorderStateDescription;
    } else {
      // TODO: Needs improvement to be localized
      this.reorderState = `${this.#reorderFinishText} ${
        this.#reorderCurrentIndex + 1
      } ${this.#reorderInstructions}`;
      this.#reorderCurrentIndex = -1;
    }
  }

  #revertReorderSteps(): void {
    if (this.#reorderSteps < 0) {
      this.#adapterService.moveItemDown(
        this.#elementRef.nativeElement,
        Math.abs(this.#reorderSteps),
      );
    } else if (this.#reorderSteps > 0) {
      this.#adapterService.moveItemUp(
        this.#elementRef.nativeElement,
        false,
        this.#reorderSteps,
      );
    }
    this.#repeaterService.registerOrderChange();
  }

  #updateContentInfo(): void {
    // The `setTimeout` here is necessary to counteract the timing for change detection with the content child for the title component.
    // Because the title component is rendered within a template ref - the loading of the content child and then acting upon that can cause "changed after checked" errors.
    setTimeout(() => {
      if (this.itemName) {
        this.#contentInfoProvider.patchInfo({
          descriptor: { type: 'text', value: this.itemName },
        });
      } else if (this.#titleComponent) {
        this.titleId = this.#idSvc.generateId();

        this.#contentInfoProvider.patchInfo({
          descriptor: {
            type: 'elementId',
            value: this.titleId,
          },
        });
      } else {
        this.titleId = undefined;
      }
    });
  }

  #updateExpandOnContentChange(): void {
    this.repeaterItemContentComponents?.changes
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.hasItemContent = !!this.repeaterItemContentComponents?.length;
        /* istanbul ignore next */
        this.isCollapsible =
          this.hasItemContent && this.#repeaterService.expandMode !== 'none';
        /* istanbul ignore else */
        if (this.#repeaterService.expandMode === 'single') {
          this.#repeaterService.onItemCollapseStateChange(this);
        }
      });
  }
}
