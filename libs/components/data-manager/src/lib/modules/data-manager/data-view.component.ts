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
import { SkyTextHighlightModule } from '@skyux/indicators';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SkyDataManagerService } from './data-manager.service';
import { SkyDataManagerState } from './models/data-manager-state';

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
  imports: [CommonModule, SkyTextHighlightModule],
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

  public get highlightText(): string | undefined {
    return this.#_searchText;
  }

  public set highlightText(value: string | undefined) {
    this.#_searchText = value;
    this.#changeDetector.markForCheck();
  }

  #_isActive = false;
  #_searchText: string | undefined;

  #ngUnsubscribe = new Subject<void>();
  #currentState: SkyDataManagerState | undefined;

  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #changeDetector = inject(ChangeDetectorRef);

  public ngOnInit(): void {
    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.isActive = this.viewId === activeViewId;
      });

    this.#dataManagerService
      .getDataViewsUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe(() => {
        this.#updateSearchHighlight(this.#currentState);
      });

    /* istanbul ignore else */
    if (this.viewId) {
      this.#dataManagerService
        .getDataStateUpdates(this.viewId)
        .pipe(takeUntil(this.#ngUnsubscribe))
        .subscribe((state: SkyDataManagerState) => {
          this.#currentState = state;
          this.#updateSearchHighlight(state);
        });
    }
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  #updateSearchHighlight(state?: SkyDataManagerState): void {
    if (this.viewId) {
      const view = this.#dataManagerService.getViewById(this.viewId);

      if (view?.searchHighlightEnabled) {
        this.highlightText = state?.searchText;
      } else if (this.highlightText) {
        this.highlightText = undefined;
      }
    }
  }
}
