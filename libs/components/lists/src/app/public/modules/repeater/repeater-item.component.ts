import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef
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
  SkyInlineFormCloseArgs,
  SkyInlineFormConfig
} from '@skyux/inline-form';

import {
  Subject
} from 'rxjs/Subject';

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
  public showInlineForm: boolean = false;

  @Output()
  public collapse = new EventEmitter<void>();

  @Output()
  public expand = new EventEmitter<void>();

  @Output()
  public inlineFormClose = new EventEmitter<SkyInlineFormCloseArgs>();

  @Output()
  public isSelectedChange = new EventEmitter<boolean>();

  public contentId: string = `sky-radio-content-${++nextContentId}`;

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

  private ngUnsubscribe = new Subject<void>();

  private _isCollapsible = true;

  private _isExpanded = true;

  private _isSelected = false;

  constructor(
    private repeaterService: SkyRepeaterService,
    private changeDetector: ChangeDetectorRef,
    private logService: SkyLogService
  ) {
    this.slideForExpanded(false);
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

  private slideForExpanded(animate: boolean): void {
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }
}
