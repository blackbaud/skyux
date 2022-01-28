import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

import { skyAnimationSlide } from '@skyux/animations';

import { SkyCheckboxChange } from '@skyux/forms';

import { SkyLibResourcesService } from '@skyux/i18n';

import {
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig,
} from '@skyux/inline-form';

import { forkJoin as observableForkJoin, Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';

import { SkyRepeaterAdapterService } from './repeater-adapter.service';

import { SkyRepeaterItemContentComponent } from './repeater-item-content.component';

import { SkyRepeaterItemContextMenuComponent } from './repeater-item-context-menu.component';

import { SkyRepeaterService } from './repeater.service';

let nextContentId: number = 0;

/**
 * Creates an individual repeater item.
 */
@Component({
  selector: 'sky-repeater-item',
  styleUrls: ['./repeater-item.component.scss'],
  templateUrl: './repeater-item.component.html',
  animations: [skyAnimationSlide],
  encapsulation: ViewEncapsulation.None,
})
export class SkyRepeaterItemComponent
  implements OnDestroy, OnInit, AfterViewInit
{
  /**
   * Specifies a human-readable name for the repeater item that is available for multiple purposes,
   * such as accessibility and instrumentation. For example, the component uses the name to
   * construct ARIA labels for the repeater item controls
   * to [support accessibility](https://developer.blackbaud.com/skyux/learn/accessibility).
   */
  @Input()
  public itemName: string;

  /**
   * Specifies configuration options for the buttons to display on an inline form
   * within the repeater. This property accepts
   * [a `SkyInlineFormConfig` object](https://developer.blackbaud.com/skyux/components/inline-form#skyinlineformconfig-properties).
   */
  @Input()
  public inlineFormConfig: SkyInlineFormConfig;

  /**
   * Specifies [an Angular `TemplateRef`](https://angular.io/api/core/TemplateRef) to use
   * as a template to instantiate an inline form within the repeater.
   */
  @Input()
  public inlineFormTemplate: TemplateRef<any>;

  /**
   * Indicates whether the repeater item is expanded.
   * @default true
   */
  @Input()
  public set isExpanded(value: boolean) {
    this.updateForExpanded(value, true);
  }

  public get isExpanded(): boolean {
    return this._isExpanded;
  }

  /**
   * Indicates whether the repeater item's checkbox is selected.
   * When users select the repeater item, the specified property on your model is updated accordingly.
   * @default false
   */
  @Input()
  public set isSelected(value: boolean) {
    if (value !== this._isSelected) {
      this._isSelected = value;
      this.isSelectedChange.emit(this._isSelected);
    }
  }

  public get isSelected(): boolean {
    return this._isSelected;
  }

  /**
   * Indicates whether users can change the order of the repeater item.
   * The repeater component's `reorderable` property must also be set to `true`.
   */
  @Input()
  public reorderable: boolean = false;

  /**
   * Indicates whether to display a checkbox in the left of the repeater item.
   */
  @Input()
  public selectable: boolean = false;

  /**
   * Indicates whether to display an inline form within the repeater.
   * Users can toggle between displaying and hiding the inline form.
   */
  @Input()
  public showInlineForm: boolean = false;

  /**
   * Specifies an object that the repeater component returns for this repeater item
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
  public contextMenu: ElementRef;

  public contentId: string = `sky-repeater-item-content-${++nextContentId}`;

  public hasItemContent: boolean = false;

  public isActive: boolean = false;

  public set isCollapsible(value: boolean) {
    if (this.isCollapsible !== value) {
      this._isCollapsible = value;

      /*istanbul ignore else */
      if (!value) {
        this.updateForExpanded(true, false);
      }
    }

    this.changeDetector.markForCheck();
  }

  public get isCollapsible(): boolean {
    return this._isCollapsible;
  }

  public keyboardReorderingEnabled: boolean = false;

  public reorderButtonLabel: string;

  public reorderState: string;

  public slideDirection: string;

  @HostBinding('class')
  get repeaterGroupClass(): string {
    return 'sky-repeater-item-group-' + this.repeaterService.repeaterGroupId;
  }

  @ViewChild('grabHandle', { read: ElementRef })
  private grabHandle: ElementRef;

  @ViewChild('itemContentRef', { read: ElementRef })
  private itemContentRef: ElementRef;

  @ViewChild('itemHeaderRef', { read: ElementRef })
  private itemHeaderRef: ElementRef;

  @ViewChild('itemRef', { read: ElementRef })
  private itemRef: ElementRef;

  @ContentChildren(SkyRepeaterItemContentComponent)
  private repeaterItemContentComponents: QueryList<SkyRepeaterItemContentComponent>;

  private ngUnsubscribe = new Subject<void>();

  private reorderCancelText: string;

  private reorderCurrentIndex: number;

  private reorderFinishText: string;

  private reorderInstructions: string;

  private reorderMovedText: string;

  private reorderStateDescription: string;

  private reorderSteps: number;

  private _isCollapsible = true;

  private _isExpanded = true;

  private _isSelected = false;

  constructor(
    private repeaterService: SkyRepeaterService,
    private changeDetector: ChangeDetectorRef,
    private adapterService: SkyRepeaterAdapterService,
    private elementRef: ElementRef,
    private resourceService: SkyLibResourcesService
  ) {
    this.slideForExpanded(false);

    observableForkJoin([
      this.resourceService.getString('skyux_repeater_item_reorder_cancel'),
      this.resourceService.getString('skyux_repeater_item_reorder_finish'),
      this.resourceService.getString(
        'skyux_repeater_item_reorder_instructions'
      ),
      this.resourceService.getString('skyux_repeater_item_reorder_operation'),
      this.resourceService.getString('skyux_repeater_item_reorder_moved'),
    ]).subscribe((translatedStrings: string[]) => {
      this.reorderCancelText = translatedStrings[0];
      this.reorderFinishText = translatedStrings[1];
      this.reorderStateDescription = translatedStrings[2];
      this.reorderInstructions = translatedStrings[3];
      this.reorderMovedText = translatedStrings[4];
      this.reorderButtonLabel = this.reorderInstructions;
    });
  }

  public ngOnInit(): void {
    this.repeaterService.registerItem(this);
    this.repeaterService.activeItemChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((item: SkyRepeaterItemComponent) => {
        const newIsActiveValue = this === item;
        if (newIsActiveValue !== this.isActive) {
          this.isActive = newIsActiveValue;
          this.changeDetector.markForCheck();
        }
      });
  }

  public ngAfterViewInit(): void {
    this.hasItemContent = this.repeaterItemContentComponents.length > 0;
    this.updateExpandOnContentChange();
  }

  public ngOnDestroy(): void {
    this.collapse.complete();
    this.expand.complete();
    this.inlineFormClose.complete();
    this.isSelectedChange.complete();

    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.repeaterService.unregisterItem(this);
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
      event.target === this.itemRef.nativeElement ||
      this.itemContentRef.nativeElement.contains(event.target) ||
      this.itemHeaderRef.nativeElement.contains(event.target)
    ) {
      this.repeaterService.activateItem(this);
    }
  }

  public updateForExpanded(value: boolean, animate: boolean): void {
    if (this.isCollapsible === false && value === false) {
      console.warn(
        `Setting isExpanded to false when the repeater item is not collapsible
        will have no effect.`
      );
    } else if (this._isExpanded !== value) {
      this._isExpanded = value;

      if (this._isExpanded) {
        this.expand.emit();
      } else {
        this.collapse.emit();
      }

      this.repeaterService.onItemCollapseStateChange(this);
      this.slideForExpanded(animate);
      this.changeDetector.markForCheck();
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
    this.adapterService.moveItemUp(this.elementRef.nativeElement, true);
    this.adapterService.focusElement(<HTMLElement>event.target);
    this.repeaterService.registerOrderChange();
  }

  public onReorderHandleKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          this.keyboardToggleReorder();
          event.preventDefault();
          event.stopPropagation();
          break;

        case 'escape':
          /* istanbul ignore else */
          if (this.keyboardReorderingEnabled) {
            this.keyboardReorderingEnabled = false;
            this.revertReorderSteps();
            this.reorderButtonLabel =
              this.reorderCancelText + ' ' + this.reorderInstructions;
            this.adapterService.focusElement(<HTMLElement>event.target);
            event.preventDefault();
            event.stopPropagation();
          }
          break;

        case 'arrowup':
          if (this.keyboardReorderingEnabled) {
            this.keyboardReorderUp();
            event.preventDefault();
            event.stopPropagation();
            this.repeaterService.registerOrderChange();
          }
          break;

        case 'arrowdown':
          /* istanbul ignore else */
          if (this.keyboardReorderingEnabled) {
            this.keyboardReorderDown();
            event.preventDefault();
            event.stopPropagation();
            this.repeaterService.registerOrderChange();
          }
          break;

        case 'arrowleft':
        case 'arrowright':
          /* istanbul ignore else */
          if (this.keyboardReorderingEnabled) {
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
    this.keyboardReorderingEnabled = false;
    this.revertReorderSteps();
    this.reorderButtonLabel = this.reorderInstructions;
    this.reorderState = undefined;
  }

  public onItemKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          /* istanbul ignore else */
          /* Sanity check */
          // Space/enter should never execute unless focused on the parent item element.
          if (event.target === this.itemRef.nativeElement) {
            if (this.selectable) {
              this.isSelected = !this.isSelected;
            }
            this.repeaterService.activateItem(this);
            event.preventDefault();
          }
          break;

        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  private slideForExpanded(animate: boolean): void {
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }

  private keyboardReorderUp(): void {
    this.reorderCurrentIndex = this.adapterService.moveItemUp(
      this.elementRef.nativeElement
    );
    this.reorderSteps--;
    this.adapterService.focusElement(this.grabHandle);
    this.keyboardReorderingEnabled = true;
    this.reorderButtonLabel = `${this.reorderMovedText} ${
      this.reorderCurrentIndex + 1
    }`;
  }

  private keyboardReorderDown(): void {
    this.reorderCurrentIndex = this.adapterService.moveItemDown(
      this.elementRef.nativeElement
    );
    this.reorderSteps++;
    this.adapterService.focusElement(this.grabHandle);
    this.keyboardReorderingEnabled = true;
    this.reorderButtonLabel = `${this.reorderMovedText} ${
      this.reorderCurrentIndex + 1
    }`;
  }

  private keyboardToggleReorder(): void {
    this.keyboardReorderingEnabled = !this.keyboardReorderingEnabled;
    this.reorderSteps = 0;

    if (this.keyboardReorderingEnabled) {
      this.reorderState = this.reorderStateDescription;
    } else {
      this.reorderState = `${this.reorderFinishText} ${
        this.reorderCurrentIndex + 1
      } ${this.reorderInstructions}`;
    }
  }

  private revertReorderSteps(): void {
    if (this.reorderSteps < 0) {
      this.adapterService.moveItemDown(
        this.elementRef.nativeElement,
        Math.abs(this.reorderSteps)
      );
    } else if (this.reorderSteps > 0) {
      this.adapterService.moveItemUp(
        this.elementRef.nativeElement,
        false,
        this.reorderSteps
      );
    }
    this.repeaterService.registerOrderChange();
  }

  private updateExpandOnContentChange(): void {
    this.repeaterItemContentComponents.changes
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.hasItemContent = this.repeaterItemContentComponents.length > 0;
        /* istanbul ignore next */
        this.isCollapsible =
          this.hasItemContent && this.repeaterService.expandMode !== 'none';
        /* istanbul ignore else */
        if (this.repeaterService.expandMode === 'single') {
          this.repeaterService.onItemCollapseStateChange(this);
        }
      });
  }
}
