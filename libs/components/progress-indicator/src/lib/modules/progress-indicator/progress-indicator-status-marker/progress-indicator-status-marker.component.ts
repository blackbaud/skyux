import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  inject,
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
  readonly #changeDetector = inject(ChangeDetectorRef);

  #_status: SkyProgressIndicatorItemStatus =
    SkyProgressIndicatorItemStatus.Active;
  #_displayMode: 'vertical' | 'horizontal' = 'vertical';

  constructor() {
    // Update icons when theme changes.
    inject(SkyThemeService, { optional: true })
      ?.settingsChange.pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#changeDetector.markForCheck();
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
