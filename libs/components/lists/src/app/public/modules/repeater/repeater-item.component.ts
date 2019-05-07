import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
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
  SkyRepeaterService
} from './repeater.service';

let nextId: number = 0;

@Component({
  selector: 'sky-repeater-item',
  styleUrls: ['./repeater-item.component.scss'],
  templateUrl: './repeater-item.component.html',
  animations: [skyAnimationSlide]
})
export class SkyRepeaterItemComponent implements OnDestroy {
  public contentId: string = `sky-radio-content-${++nextId}`;

  public get isExpanded(): boolean {
    return this._isExpanded;
  }

  @Input()
  public set isExpanded(value: boolean) {
    this.updateForExpanded(value, true);
  }

  public get isSelected(): boolean {
    return this._isSelected;
  }

  @Input()
  public set isSelected(value: boolean) {
    this._isSelected = value;
  }

  @Input()
  public showInlineForm: boolean = false;

  @Input()
  public inlineFormConfig: SkyInlineFormConfig;

  @Input()
  public inlineFormTemplate: TemplateRef<any>;

  @Output()
  public inlineFormClose = new EventEmitter<SkyInlineFormCloseArgs>();

  @Input()
  public selectable: boolean = false;

  @Output()
  public collapse = new EventEmitter<void>();

  @Output()
  public expand = new EventEmitter<void>();

  public slideDirection: string;

  public get isCollapsible(): boolean {
    return this._isCollapsible;
  }
  public set isCollapsible(value: boolean) {
    if (this.isCollapsible !== value) {
      this._isCollapsible = value;

      /*istanbul ignore else */
      if (!value) {
        this.updateForExpanded(true, false);
      }
    }
  }

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

  public ngOnDestroy(): void {
    this.collapse.complete();
    this.expand.complete();
    this.inlineFormClose.complete();
  }

  public headerClick() {
    if (this.isCollapsible) {
      this.updateForExpanded(!this.isExpanded, true);
    }
  }

  public chevronDirectionChange(direction: string) {
    this.updateForExpanded(direction === 'up', true);
  }

  public updateForExpanded(value: boolean, animate: boolean) {
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

  public updateIsSelected(value: SkyCheckboxChange) {
    this._isSelected = value.checked;
  }

  public onInlineFormClose(inlineFormCloseArgs: SkyInlineFormCloseArgs): void {
    this.inlineFormClose.emit(inlineFormCloseArgs);
  }

  private slideForExpanded(animate: boolean) {
    this.slideDirection = this.isExpanded ? 'down' : 'up';
  }
}
