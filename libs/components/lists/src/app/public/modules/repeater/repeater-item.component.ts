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
    if (value !== this._isSelected) {
      this._isSelected = value;
      this.isSelectedChange.emit(this._isSelected);
    }
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

  /**
   * Specifies an object that the repeater component returns for this repeater item when the `orderChange` event fires.
   * Required if you set the `reorderable` property to `true`.
   */
  @Input()
  public tag: any;

  @ContentChild(SkyRepeaterItemContextMenuComponent, { read: ElementRef })
  public contextMenu: ElementRef;

  @ViewChild('grabHandle', { read: ElementRef })
  private grabHandle: ElementRef;

  @ViewChild('itemRef', { read: ElementRef })
  private itemRef: ElementRef;

  @ViewChild('itemContentRef', { read: ElementRef })
  private itemContentRef: ElementRef;

  @ViewChild('itemHeaderRef', { read: ElementRef })
  private itemHeaderRef: ElementRef;

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
    if (event.target === this.itemRef.nativeElement ||
        this.itemContentRef.nativeElement.contains(event.target) ||
        this.itemHeaderRef.nativeElement.contains(event.target)) {
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

  public onCheckboxChange(value: SkyCheckboxChange): void {
    this.isSelected = value.checked;
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormClose.emit(inlineFormCloseArgs);
  }

  public moveToTop(event: Event): void {
    event.stopPropagation();
    this.adapterService.moveItemUp(this.elementRef.nativeElement, true);
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

  public onItemKeyDown(event: KeyboardEvent): void {
    /*istanbul ignore else */
    if (event.key) {
      switch (event.key.toLowerCase()) {
        case ' ':
        case 'enter':
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
    this.reorderCurrentIndex = this.adapterService.moveItemUp(this.elementRef.nativeElement);
    this.reorderSteps--;
    this.adapterService.focusElement(this.grabHandle);
    this.keyboardReorderingEnabled = true;
    this.reorderButtonLabel = `${this.reorderMovedText} ${this.reorderCurrentIndex + 1}`;
  }

  private keyboardReorderDown(): void {
    this.reorderCurrentIndex = this.adapterService.moveItemDown(this.elementRef.nativeElement);
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
      this.adapterService.moveItemDown(this.elementRef.nativeElement, Math.abs(this.reorderSteps));
    } else if (this.reorderSteps > 0) {
      this.adapterService.moveItemUp(this.elementRef.nativeElement, false, this.reorderSteps);
    }
    this.repeaterService.registerOrderChange();
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
