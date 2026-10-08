import { Directive, computed, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDataColumnSource } from '@skyux/lists';

import { map } from 'rxjs';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataViewComponent } from '../data-view.component';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataViewState } from '../models/data-view-state';

import {
  SkyDataManagerColumnState,
  reconcileColumnState,
} from './data-manager-column-state';

const SOURCE_ID = 'skyDataManagerColumnController';

// The column options any instance of the directive has published to a view
// config. A directive recreated with its view, such as when the user switches
// views, recognizes them as its own rather than as options the view config
// supplies.
const PUBLISHED_COLUMN_OPTIONS = new WeakSet<
  SkyDataManagerColumnPickerOption[]
>();

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

/**
 * Connects a `sky-data-grid` to the data manager of the `sky-data-view` that
 * contains it. The data manager's column picker offers the grid's columns and
 * controls which of them display, and the columns the user displays and
 * reorders are stored in the view state, so the view config does not need to
 * supply `columnOptions`.
 * @preview
 */
@Directive({ selector: '[skyDataManagerColumnController]' })
export class SkyDataManagerColumnControllerDirective {
  readonly #columnSource = inject(SkyDataColumnSource, { self: true });
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataView = inject(SkyDataViewComponent);

  // Subscribe under a different ID than the one updates are published with,
  // so the directive also receives its own updates and always holds the
  // current data state.
  readonly #dataState = toSignal(
    this.#dataManagerSvc.getDataStateUpdates(`${SOURCE_ID}#dataState`),
  );

  // The service changes its view config array in place before re-emitting it,
  // so copy it for the signal to register the change.
  readonly #viewConfigs = toSignal(
    this.#dataManagerSvc.getDataViewsUpdates().pipe(map((views) => [...views])),
    { requireSync: true },
  );

  readonly #pickerColumnOptions = computed<SkyDataManagerColumnPickerOption[]>(
    () =>
      this.#columnSource.columnOptions().map((column) => ({
        alwaysDisplayed: column.alwaysDisplayed,
        description: column.description,
        id: column.id,
        initialHide: column.initialHide,
        label: column.labelText,
      })),
  );

  /**
   * The view's stored column state, reconciled against the columns the source
   * currently declares. This is `undefined` until the data manager emits its
   * first state, so a stored column layout is never overwritten by the
   * source's declarative default.
   */
  readonly #reconciledState = computed<SkyDataManagerColumnState | undefined>(
    () => {
      const dataState = this.#dataState();
      const columnOptions = this.#columnSource.columnOptions();
      const viewId = this.#dataView.viewId;

      if (!dataState || !viewId || columnOptions.length === 0) {
        return undefined;
      }

      return reconcileColumnState(
        dataState.getViewStateById(viewId),
        columnOptions,
      );
    },
  );

  constructor() {
    // Offer the source's columns in the column picker. A view config that
    // supplies its own column options keeps them.
    effect(() => {
      const columnOptions = this.#pickerColumnOptions();
      const viewId = this.#dataView.viewId;
      const view = this.#viewConfigs().find((config) => config.id === viewId);

      if (
        view &&
        view.columnOptions !== columnOptions &&
        (!view.columnOptions ||
          PUBLISHED_COLUMN_OPTIONS.has(view.columnOptions))
      ) {
        PUBLISHED_COLUMN_OPTIONS.add(columnOptions);
        this.#dataManagerSvc.updateViewConfig({ ...view, columnOptions });
      }
    });

    // Apply the view's column state to the source, then store what the source
    // displays, which also records columns added or removed since the state
    // was stored. The source is read untracked so that a user reordering
    // columns does not re-run this effect and restore the stored order.
    effect(() => {
      const state = this.#reconciledState();

      if (state) {
        untracked(() => {
          this.#columnSource.setDisplayedColumnIds(state.displayedColumnIds);
          this.#storeColumnState(
            state.columnIds,
            this.#columnSource.displayedColumnIds(),
          );
        });
      }
    });

    // Store changes the user makes in the source itself, such as reordering
    // columns by dragging a column header. Only the source is tracked, so a data
    // state change re-runs the effect above rather than this one.
    effect(() => {
      const displayedColumnIds = this.#columnSource.displayedColumnIds();

      untracked(() => {
        const state = this.#reconciledState();

        if (state) {
          this.#storeColumnState(state.columnIds, displayedColumnIds);
        }
      });
    });
  }

  #storeColumnState(
    columnIds: string[],
    displayedColumnIds: readonly string[],
  ): void {
    const dataState = this.#dataState();
    const viewId = this.#dataView.viewId;

    /* istanbul ignore if: the column state only exists once both are set */
    if (!dataState || !viewId) {
      return;
    }

    const viewState =
      dataState.getViewStateById(viewId) ?? new SkyDataViewState({ viewId });

    if (
      arraysEqual(viewState.columnIds, columnIds) &&
      arraysEqual(viewState.displayedColumnIds, displayedColumnIds)
    ) {
      return;
    }

    const updatedViewState = new SkyDataViewState(
      viewState.getViewStateOptions(),
    );
    updatedViewState.columnIds = columnIds;
    updatedViewState.displayedColumnIds = [...displayedColumnIds];

    this.#dataManagerSvc.updateDataState(
      dataState.addOrUpdateView(viewId, updatedViewState),
      SOURCE_ID,
    );
  }
}
