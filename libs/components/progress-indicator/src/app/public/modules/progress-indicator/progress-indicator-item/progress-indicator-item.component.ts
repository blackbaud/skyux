import {
  Component,
  Input
} from '@angular/core';

import {
  SkyProgressIndicatorDisplayMode
} from '../types/progress-indicator-mode';

@Component({
  selector: 'sky-progress-indicator-item',
  templateUrl: './progress-indicator-item.component.html',
  styleUrls: ['./progress-indicator-item.component.scss']
})
export class SkyProgressIndicatorItemComponent {
  public itemNumber: number;
  public isActive = false;
  public isComplete = false;
  public isLastItem = false;
  public displayMode = SkyProgressIndicatorDisplayMode.Vertical;
  public isPassive = false;
  public isNextToInactive = true;

  @Input()
  public title: string;

  public get displayTitle(): string {
    if (this.isPassive) {
      return this.isActive || this.isComplete ? this.title : '';
    } else {
      return this.itemNumber + ' - ' + this.title;
    }
  }

  public get isLineDisplayed(): boolean {
    return !(this.isHorizontal || this.isPassive) || this.isPassive && !this.isLastItem || this.isActive;
  }

  public get headingClassList(): {[className: string]: boolean} {
    return {
      'sky-text-success': this.isComplete && !this.isActive && !this.isHorizontal,
      'sky-progress-indicator-item-passive': this.isPassive,
      'sky-progress-indicator-item-step': !this.isHorizontal && (!this.isComplete || this.isActive),
      'sky-progress-indicator-item-step-active': this.isActive,
      'sky-progress-indicator-item-step-complete': this.isComplete && !this.isActive && !this.isHorizontal
    };
  }

  public get lineClassList(): {[className: string]: boolean} {
    return {
      'sky-deemphasized': this.isPassive,
      'sky-progress-indicator-item-passive': this.isPassive,
      'sky-progress-indicator-item-horizontal': this.isHorizontal,
      'sky-progress-indicator-item-last': this.isLastItem,
      'sky-progress-indicator-item-line-inactive': !this.isActive && !this.isComplete,
      'sky-progress-indicator-item-line-next-inactive': this.isNextToInactive
    };
  }

  public get isHorizontal(): boolean {
    return this.displayMode === SkyProgressIndicatorDisplayMode.Horizontal;
  }
}
