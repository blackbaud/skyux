import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  inject,
} from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';
import { SkyTextHighlightDirective } from '@skyux/indicators';

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
  selector: 'sky-data-view',
  templateUrl: './data-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [SkyResponsiveHostDirective, SkyTextHighlightDirective],
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class SkyDataViewComponent implements OnDestroy, OnInit {
  /**
   * The configuration for the view. See the `SkyDataViewConfig` interface.
   * @required
   */
  @Input()
  public viewId: string | undefined;

  @HostBinding('attr.data-view-id')
  public get dataViewId(): string | undefined {
    return this.viewId;
  }

  public get isActive(): boolean {
    return this.#_isActive;
  }

  public set isActive(value: boolean) {
    this.#_isActive = value;
    this.#changeDetector.markForCheck();
  }

  public get textHighlight(): string | undefined {
    return this.#_textHighlight;
  }

  public set textHighlight(value: string | undefined) {
    this.#_textHighlight = value;
    this.#textHighlight.skyHighlight = value;
    this.#changeDetector.markForCheck();
  }

  #_isActive = false;
  #_textHighlight: string | undefined;

  #ngUnsubscribe = new Subject<void>();
  #currentState: SkyDataManagerState | undefined;

  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #changeDetector = inject(ChangeDetectorRef);
  #textHighlight: SkyTextHighlightDirective = inject(
    SkyTextHighlightDirective,
    { self: true },
  );

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
        this.textHighlight = state?.searchText;
      } else if (this.textHighlight) {
        this.textHighlight = undefined;
      }
    }
  }
}
