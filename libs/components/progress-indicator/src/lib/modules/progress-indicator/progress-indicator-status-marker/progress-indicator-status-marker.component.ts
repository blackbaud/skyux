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

import { SkyProgressIndicatorItemStatusType } from '../types/progress-indicator-item-status-type';

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
    this.#_displayMode = value;
  }

  public get displayMode(): 'vertical' | 'horizontal' {
    return this.#_displayMode;
  }

  @Input()
  public set status(value: SkyProgressIndicatorItemStatusType) {
    this.#_status = value;
  }

  public get status(): SkyProgressIndicatorItemStatusType {
    return this.#_status;
  }

  #ngUnsubscribe = new Subject<void>();
  #changeDetector: ChangeDetectorRef;

  #_status: SkyProgressIndicatorItemStatusType = 'active';
  #_displayMode: 'vertical' | 'horizontal' = 'vertical';

  constructor(
    changeDetector: ChangeDetectorRef,
    @Optional() themeSvc?: SkyThemeService
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
