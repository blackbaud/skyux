import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

import {
  SkyProgressIndicatorItemStatus
} from '../types';

@Component({
  selector: 'sky-progress-indicator-item',
  templateUrl: './progress-indicator-item.component.html',
  styleUrls: ['./progress-indicator-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorItemComponent {

  @Input()
  public title: string;

  public get formattedTitle(): string {
    return `${this.titlePrefix}${this.title}`;
  }

  public get status(): SkyProgressIndicatorItemStatus {
    /* istanbul ignore next */
    if (this._status === undefined) {
      return SkyProgressIndicatorItemStatus.Incomplete;
    }

    return this._status;
  }

  public set status(value: SkyProgressIndicatorItemStatus) {
    if (value === this._status) {
      return;
    }

    this._status = value;
    this.changeDetector.markForCheck();
  }

  public get statusName(): string {
    let name: string;

    /* tslint:disable-next-line:switch-default */
    switch (this.status) {
      case SkyProgressIndicatorItemStatus.Active:
      name = 'active';
      break;

      case SkyProgressIndicatorItemStatus.Complete:
      name = 'complete';
      break;

      case SkyProgressIndicatorItemStatus.Incomplete:
      name = 'incomplete';
      break;

      case SkyProgressIndicatorItemStatus.Pending:
      name = 'pending';
      break;
    }

    return name;
  }

  public isVisible = false;
  public showStatusMarker = true;
  public showTitle = true;

  private titlePrefix: string;

  private _status: SkyProgressIndicatorItemStatus;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }

  public showStepNumber(step: number): void {
    this.titlePrefix = `${step} - `;
  }

  public hideStepNumber(): void {
    this.titlePrefix = '';
  }
}
