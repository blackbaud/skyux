import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input
} from '@angular/core';

import {
  SkyProgressIndicatorDisplayMode,
  SkyProgressIndicatorItemStatus
} from '../types';

@Component({
  selector: 'sky-progress-indicator-status-marker',
  templateUrl: './progress-indicator-status-marker.component.html',
  styleUrls: ['./progress-indicator-status-marker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkyProgressIndicatorStatusMarkerComponent {
  @Input()
  public set displayMode(value: SkyProgressIndicatorDisplayMode) {
    this._displayMode = value;
  }

  public get displayMode(): SkyProgressIndicatorDisplayMode {
    if (this._displayMode === undefined) {
      return SkyProgressIndicatorDisplayMode.Vertical;
    }

    return this._displayMode;
  }

  @Input()
  public set status(value: SkyProgressIndicatorItemStatus) {
    this._status = value;
    this.changeDetector.markForCheck();
  }

  public get cssClassNames(): string {
    const classNames = [
      `sky-progress-indicator-status-marker-mode-${this.displayModeName}`,
      `sky-progress-indicator-status-marker-status-${this.statusName}`
    ];

    return classNames.join(' ');
  }

  public get displayModeName(): string {
    if (this.displayMode === SkyProgressIndicatorDisplayMode.Vertical) {
      return 'vertical';
    }

    return 'horizontal';
  }

  public get statusName(): string {
    let name: string;

    /* tslint:disable-next-line:switch-default */
    switch (this._status) {
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

  private _displayMode: SkyProgressIndicatorDisplayMode;
  private _status: SkyProgressIndicatorItemStatus;

  constructor(
    private changeDetector: ChangeDetectorRef
  ) { }
}
