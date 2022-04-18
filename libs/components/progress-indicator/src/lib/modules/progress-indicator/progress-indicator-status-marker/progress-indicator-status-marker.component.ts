import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  Optional,
} from '@angular/core';
import { SkyThemeService } from '@skyux/theme';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyProgressIndicatorItemStatus } from '../types/progress-indicator-item-status';

/**
 * Specifies the content to display in the status marker.
 * @internal
 */
@Component({
  selector: 'sky-progress-indicator-status-marker',
  templateUrl: './progress-indicator-status-marker.component.html',
  styleUrls: ['./progress-indicator-status-marker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkyProgressIndicatorStatusMarkerComponent implements OnDestroy {
  @Input()
  public set displayMode(value: 'vertical' | 'horizontal') {
    this._displayMode = value;
  }

  public get displayMode(): 'vertical' | 'horizontal' {
    if (this._displayMode === undefined) {
      return 'vertical';
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
      `sky-progress-indicator-status-marker-mode-${this.displayMode}`,
      `sky-progress-indicator-status-marker-status-${this.statusName}`,
    ];

    return classNames.join(' ');
  }

  public get statusName(): string {
    let name: string;

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

  private ngUnsubscribe = new Subject<void>();

  private _displayMode: 'vertical' | 'horizontal';
  private _status: SkyProgressIndicatorItemStatus;

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Optional() themeSvc?: SkyThemeService
  ) {
    // Update icons when theme changes.
    themeSvc?.settingsChange
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(() => {
        this.changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
