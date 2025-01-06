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
  standalone: false,
})
export class SkyProgressIndicatorStatusMarkerComponent implements OnDestroy {
  @Input()
  public set displayMode(value: 'vertical' | 'horizontal') {
    this.#_displayMode = value;
  }

  public get displayMode(): 'vertical' | 'horizontal' {
    return this.#_displayMode;
  }

  @Input()
  public set status(value: SkyProgressIndicatorItemStatus) {
    this.#_status = value;
    this.isComplete = this.#_status === SkyProgressIndicatorItemStatus.Complete;
  }

  public get status(): SkyProgressIndicatorItemStatus {
    return this.#_status;
  }

  public isComplete = false;

  #ngUnsubscribe = new Subject<void>();
  #changeDetector: ChangeDetectorRef;

  #_status: SkyProgressIndicatorItemStatus =
    SkyProgressIndicatorItemStatus.Active;
  #_displayMode: 'vertical' | 'horizontal' = 'vertical';

  constructor(
    changeDetector: ChangeDetectorRef,
    @Optional() themeSvc?: SkyThemeService,
  ) {
    this.#changeDetector = changeDetector;

    // Update icons when theme changes.
    themeSvc?.settingsChange
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
