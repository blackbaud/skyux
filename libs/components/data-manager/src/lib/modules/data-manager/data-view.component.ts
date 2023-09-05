import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from './data-manager.service';

/**
 * A data view is rendered within a data manager component.
 * It can subscribe to data state changes from `SkyDataManagerService` and apply the filters,
 * search text, and more to the data it displays.
 */
@Component({
  standalone: true,
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class SkyDataViewComponent implements OnDestroy, OnInit {
  /**
   * The configuration for the view. See the `SkyDataViewConfig` interface.
   * @required
   */
  @Input()
  public viewId: string | undefined;

  public get isActive(): boolean {
    return this.#_isActive;
  }

  public set isActive(value: boolean) {
    this.#_isActive = value;
    this.#changeDetector.markForCheck();
  }

  #_isActive = false;

  #ngUnsubscribe = new Subject<void>();

  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #changeDetector = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.isActive = this.viewId === activeViewId;
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }
}
