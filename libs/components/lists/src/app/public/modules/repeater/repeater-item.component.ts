import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';

import {
  skyAnimationSlide
} from '@skyux/animations';

import {
  SkyLogService
} from '@skyux/core';

import {
  SkyCheckboxChange
} from '@skyux/forms';

import {
  SkyLibResourcesService
} from '@skyux/i18n';

import {
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '@skyux/inline-form';

import {
  SkyInlineDeleteComponent
} from '@skyux/layout/modules/inline-delete';

import {
  Observable,
  Subject
} from 'rxjs';

import 'rxjs/add/observable/forkJoin';

import {
  SkyRepeaterAdapterService
} from './repeater-adapter.service';

import {
  SkyRepeaterItemContentComponent
} from './repeater-item-content.component';

import {
  SkyRepeaterItemContextMenuComponent
} from './repeater-item-context-menu.component';

import {
  SkyRepeaterService
} from './repeater.service';

let nextContentId: number = 0;

@Component({
  selector: 'sky-repeater-item',
  styleUrls: ['./repeater-item.component.scss'],
  templateUrl: './repeater-item.component.html',
  animations: [skyAnimationSlide]
})
export class SkyRepeaterItemComponent implements OnDestroy, OnInit, AfterViewInit {

  @Input()
  public inlineFormConfig: SkyInlineFormConfig;

  @Input()
  public inlineFormTemplate: TemplateRef<any>;

  @Input()
  public set isExpanded(value: boolean) {
    this.updateForExpanded(value, true);
  }

  public get isExpanded(): boolean {
    return this._isExpanded;
  }

  @Input()
  public set isSelected(value: boolean) {
    this._isSelected = value;
  }

  public get isSelected(): boolean {
    return this._isSelected;
  }

  @Input()
  public selectable: boolean = false;

  @Input()
  public reorderable: boolean = false;

  @Input()
  public showInlineForm: boolean = false;

  @Output()
  public collapse = new EventEmitter<void>();

  @Output()
  public expand = new EventEmitter<void>();

  @Output()
  public inlineFormClose = new EventEmitter<SkyInlineFormCloseArgs>();

  @Output()
  public isSelectedChange = new EventEmitter<boolean>();

  public set childFocusIndex(value: number) {
    if (value !== this._childFocusIndex) {
      this._childFocusIndex = value;

      const focusableChildren = this.adapterService.getFocusableChildren(this.itemRef);
      if (focusableChildren.length > 0 && value !== undefined) {
        this.adapterService.focusElement(focusableChildren[value]);
      } else {
        this.adapterService.focusElement(this.itemRef);
      }
    }
  }

  public get childFocusIndex(): number {
    return this._childFocusIndex;
  }

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

  public slideDirection: string;
  public keyboardReorderingEnabled: boolean = false;
  public reorderButtonLabel: string;
  public reorderState: string;

  public tabIndex: number = -1;

  /**
   * Specifies an object that the repeater component returns for this repeater item when the `orderChange` event fires.
   * Required if you set the `reorderable` property to `true`.
   */
  @Input()
  public tag: any;

  @ContentChild(SkyRepeaterItemContextMenuComponent, { read: ElementRef })
  public contextMenu: ElementRef;

  @ContentChild(SkyInlineDeleteComponent)
  public inlineDelete: SkyInlineDeleteComponent;

  @ViewChild('skyRepeaterItem', { read: ElementRef })
  private itemRef: ElementRef;

  @ViewChild('grabHandle', { read: ElementRef })
  private grabHandle: ElementRef;

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

  private _childFocusIndex: number;

  private _isCollapsible = true;

  private _isExpanded = true;

  private _isSelected = false;

  constructor(
    private repeaterService: SkyRepeaterService,
    private changeDetector: ChangeDetectorRef,
    private logService: SkyLogService,
    private adapterService: SkyRepeaterAdapterService,
    private elementRef: ElementRef,
    private resourceService: SkyLibResourcesService
  ) {
    this.slideForExpanded(false);

    // tslint:disable-next-line: deprecation
    Observable.forkJoin(
      this.resourceService.getString('skyux_repeater_item_reorder_cancel'),
      this.resourceService.getString('skyux_repeater_item_reorder_finish'),
      this.resourceService.getString('skyux_repeater_item_reorder_instructions'),
      this.resourceService.getString('skyux_repeater_item_reorder_operation'),
      this.resourceService.getString('skyux_repeater_item_reorder_moved')
    )
    .subscribe((translatedStrings: string[]) => {
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
      .takeUntil(this.ngUnsubscribe)
      .subscribe((item: SkyRepeaterItemComponent) => {
        const newIsActiveValue = this === item;
        if (newIsActiveValue !== this.isActive) {
          this.isActive = newIsActiveValue;
          this.changeDetector.markForCheck();
        }
    });

    // When service emits a focus change, set the tabIndex and browser focus.
    this.repeaterService.focusedItemChange
      .takeUntil(this.ngUnsubscribe)
      .subscribe((item: SkyRepeaterItemComponent) => {
        if (this === item) {
          this.tabIndex = 0;

          if (!this.itemRef.nativeElement.contains(document.activeElement)) {
            this.adapterService.focusElement(this.itemRef);
          }
        } else {
          this.tabIndex = -1;
        }
    });
  }

  public ngAfterViewInit(): void {
    this.adapterService.setTabIndexOfFocusableElements(this.itemRef, -1, true);
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

  public onContextMenuKeydown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      const reservedKeys = ['enter', ' ', 'arrowdown', 'arrowup'];
      if (reservedKeys.indexOf(event.key.toLowerCase()) > -1) {
        event.stopPropagation();
      }
    }
  }

  public onFocus(): void {
    this.childFocusIndex = undefined;
  }

  public onItemKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
          // Unlike the arrow keys, space/enter should never execute
          // unless focused on the parent item element.
          if (event.target === this.itemRef.nativeElement) {
            this.toggleSelected();
            this.repeaterService.activateItem(this);
            event.preventDefault();
          }
          break;

        case 'arrowup':
          this.childFocusIndex = undefined;
          this.repeaterService.focusPreviousListItem(this);
          event.preventDefault();
          event.stopPropagation();
          break;

        case 'arrowdown':
          this.childFocusIndex = undefined;
          this.repeaterService.focusNextListItem(this);
          event.preventDefault();
          event.stopPropagation();
          break;

        case 'arrowleft': {
          // Cycle backwards through interactive child elements.
          // If user reaches the beginning, focus on parent item.
          const focusableChildren = this.adapterService.getFocusableChildren(this.itemRef);
          if (focusableChildren.length > 0) {
            if (this.childFocusIndex > 0) {
              this.childFocusIndex--;
            } else if (this.childFocusIndex === 0) {
              this.childFocusIndex = undefined;
            }
          }
          event.stopPropagation();
          event.preventDefault();
          break;
        }

        case 'arrowright': {
          // Cyle forward through interactive child elements.
          // If user reaches the end, do nothing.
          const focusableChildren = this.adapterService.getFocusableChildren(this.itemRef);
          if (focusableChildren.length > 0) {
            if (this.childFocusIndex < focusableChildren.length - 1) {
              this.childFocusIndex++;
            } else if (this.childFocusIndex === undefined) {
              this.childFocusIndex = 0;
            }
          }
          event.stopPropagation();
          event.preventDefault();
          break;
        }

        /* istanbul ignore next */
        default:
          break;
      }
    }
  }

  public onRepeaterItemClick(event: MouseEvent): void {
    if (!this.inlineDelete) {
      const focusableChildren = this.adapterService.getFocusableChildren(this.itemRef);
      if (focusableChildren.indexOf(<HTMLElement> event.target) < 0) {
        this.childFocusIndex = undefined;
      } else {
        this.childFocusIndex = focusableChildren.indexOf(<HTMLElement> event.target);
      }
      this.repeaterService.focusListItem(this);
      this.repeaterService.activateItem(this);
    }
  }

  public updateForExpanded(value: boolean, animate: boolean): void {
    if (this.isCollapsible === false && value === false) {
      this.logService.warn(
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

  public updateIsSelected(value: SkyCheckboxChange): void {
    this._isSelected = value.checked;
    this.isSelectedChange.emit(this._isSelected);
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormClose.emit(inlineFormCloseArgs);
  }

  public moveToTop(event: Event): void {
    event.stopPropagation();
    this.adapterService.moveItemUp(this.elementRef, true);
    this.adapterService.focusElement(<HTMLElement> event.target);
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
          if (this.keyboardReorderingEnabled) {
            this.keyboardReorderingEnabled = false;
            this.revertReorderSteps();
            this.reorderButtonLabel = this.reorderCancelText + ' ' + this.reorderInstructions;
            this.adapterService.focusElement(<HTMLElement> event.target);
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
          if (this.keyboardReorderingEnabled) {
            this.keyboardReorderDown();
            event.preventDefault();
            event.stopPropagation();
            this.repeaterService.registerOrderChange();
          }
          break;

        case 'arrowleft':
        case 'arrowright':
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

  private slideForExpanded(animate: boolean): void {
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }

  private keyboardReorderUp(): void {
    this.reorderCurrentIndex = this.adapterService.moveItemUp(this.elementRef);
    this.reorderSteps--;
    this.adapterService.focusElement(this.grabHandle);
    this.keyboardReorderingEnabled = true;
    this.reorderButtonLabel = `${this.reorderMovedText} ${this.reorderCurrentIndex + 1}`;
  }

  private keyboardReorderDown(): void {
    this.reorderCurrentIndex = this.adapterService.moveItemDown(this.elementRef);
    this.reorderSteps++;
    this.adapterService.focusElement(this.grabHandle);
    this.keyboardReorderingEnabled = true;
    this.reorderButtonLabel = `${this.reorderMovedText} ${this.reorderCurrentIndex + 1}`;
  }

  private keyboardToggleReorder(): void {
    this.keyboardReorderingEnabled = !this.keyboardReorderingEnabled;
    this.reorderSteps = 0;

    if (this.keyboardReorderingEnabled) {
      this.reorderState = this.reorderStateDescription;
    } else {
      this.reorderState =
        `${this.reorderFinishText} ${this.reorderCurrentIndex + 1} ${this.reorderInstructions}`;
    }
  }

  private revertReorderSteps(): void {
    if (this.reorderSteps < 0) {
      this.adapterService.moveItemDown(this.elementRef, Math.abs(this.reorderSteps));
    } else if (this.reorderSteps > 0) {
      this.adapterService.moveItemUp(this.elementRef, false, this.reorderSteps);
    }
    this.repeaterService.registerOrderChange();
  }

  private toggleSelected(): void {
    if (this.selectable) {
      this.isSelected = !this.isSelected;
    }
  }

  private updateExpandOnContentChange(): void {
    this.repeaterItemContentComponents.changes
      .takeUntil(this.ngUnsubscribe)
      .subscribe(() => {
        this.hasItemContent = this.repeaterItemContentComponents.length > 0;
        this.isCollapsible = this.hasItemContent && this.repeaterService.expandMode !== 'none';
        if (this.repeaterService.expandMode === 'single') {
          this.repeaterService.onItemCollapseStateChange(this);
        }
      });
  }
}
