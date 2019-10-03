import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
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
  SkyRepeaterService
} from './repeater.service';

import {
  SkyRepeaterAdapterService
} from './repeater-adapter.service';

let nextContentId: number = 0;

@Component({
  selector: 'sky-repeater-item',
  styleUrls: ['./repeater-item.component.scss'],
  templateUrl: './repeater-item.component.html',
  animations: [skyAnimationSlide]
})
export class SkyRepeaterItemComponent implements OnDestroy, OnInit {

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

  public contentId: string = `sky-repeater-item-content-${++nextContentId}`;

  public isActive: boolean = false;

  @ViewChild('grabHandle', { read: ElementRef })
  private grabHandle: ElementRef;

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
    setTimeout(() => {
      this.repeaterService.registerItem(this);
      this.repeaterService.activeItemChange
        .takeUntil(this.ngUnsubscribe)
        .subscribe((item: SkyRepeaterItemComponent) => {
          this.isActive = this === item;
          this.changeDetector.markForCheck();
        });
    });
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
    (<HTMLElement> event.target).focus();
  }

  public onReorderHandleKeyDown(event: KeyboardEvent): void {
    let key = event.key.toLowerCase();
    if (key === ' ' || key === 'enter') {
      this.keyboardReorderingEnabled = !this.keyboardReorderingEnabled;
      this.reorderSteps = 0;

      if (this.keyboardReorderingEnabled) {
        this.reorderState = this.reorderStateDescription;
      } else {
        this.reorderState = this.reorderFinishText + ' ' + (this.reorderCurrentIndex + 1)  + ' ' + this.reorderInstructions;
      }
    } else if (key === 'escape') {
      this.keyboardReorderingEnabled = false;

      if (this.reorderSteps < 0) {
        this.adapterService.moveItemDown(this.elementRef, Math.abs(this.reorderSteps));
      } else if (this.reorderSteps > 0) {
        this.adapterService.moveItemUp(this.elementRef, false, this.reorderSteps);
      }

      this.reorderButtonLabel = this.reorderCancelText + ' ' + this.reorderInstructions;

      (<HTMLElement> event.target).focus();
    } else if (this.keyboardReorderingEnabled && key.startsWith('arrow')) {
      let direction = event.key.toLowerCase().replace('arrow', '');
      if (direction === 'up') {
        this.reorderCurrentIndex = this.adapterService.moveItemUp(this.elementRef);
        this.reorderSteps--;
        this.grabHandle.nativeElement.focus();
        this.keyboardReorderingEnabled = true;
        this.reorderButtonLabel = this.reorderMovedText + ' ' + (this.reorderCurrentIndex + 1);
      } else if (direction === 'down') {
        this.reorderCurrentIndex = this.adapterService.moveItemDown(this.elementRef);
        this.reorderSteps++;
        this.grabHandle.nativeElement.focus();
        this.keyboardReorderingEnabled = true;
        this.reorderButtonLabel = this.reorderMovedText + ' ' + (this.reorderCurrentIndex + 1);
      }

      event.preventDefault();
    }
    event.stopPropagation();
  }

  public onReorderHandleBlur(event: any): void {
    this.keyboardReorderingEnabled = false;

    if (this.reorderSteps < 0) {
      this.adapterService.moveItemDown(this.elementRef, Math.abs(this.reorderSteps));
    } else if (this.reorderSteps > 0) {
      this.adapterService.moveItemUp(this.elementRef, false, this.reorderSteps);
    }
    this.reorderButtonLabel = this.reorderInstructions;
    this.reorderState = undefined;
  }

  private slideForExpanded(animate: boolean): void {
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }
}
