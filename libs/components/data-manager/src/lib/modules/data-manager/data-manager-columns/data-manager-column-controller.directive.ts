import {
  DestroyRef,
  Directive,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService } from '@skyux/core';
import { SkyDataColumnSource } from '@skyux/lists';

import { map } from 'rxjs';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataViewComponent } from '../data-view.component';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataViewConfig } from '../models/data-view-config';
import { SkyDataViewState } from '../models/data-view-state';

import {
  SkyDataManagerColumnState,
  reconcileColumnState,
} from './data-manager-column-state';

const SOURCE_ID = 'skyDataManagerColumnController';

// The data views that a column controller controls. A data view stores a
// single column layout, so only one column controller can control it.
const CONTROLLED_DATA_VIEWS = new WeakSet<SkyDataViewComponent>();

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

/**
 * Connects a `sky-data-grid` to the data manager of the `sky-data-view` that
 * contains it. The data manager's column picker offers the grid's columns and
 * controls which of them display, and the columns the user displays and
 * reorders are stored in the view state, so the view config does not need to
 * supply `columnOptions`. Set `columnPickerEnabled` on the view config to
 * display the column picker.
 * @preview
 */
@Directive({ selector: '[skyDataManagerColumnController]' })
export class SkyDataManagerColumnControllerDirective {
  readonly #columnSource = inject(SkyDataColumnSource, { self: true });
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataView = inject(SkyDataViewComponent);
  readonly #logger = inject(SkyLogService);

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

  #controlsDataView: boolean | undefined;
  #publishedColumnOptions: SkyDataManagerColumnPickerOption[] | undefined;

  constructor() {
    // Withdraw the published column options so that a column controller
    // created later, such as when the grid is recreated, publishes its own.
    inject(DestroyRef).onDestroy(() => {
      if (this.#controlsDataView) {
        CONTROLLED_DATA_VIEWS.delete(this.#dataView);
      }

      const view = this.#findViewConfig();
      if (
        view?.columnOptions &&
        view.columnOptions === this.#publishedColumnOptions
      ) {
        this.#dataManagerSvc.updateViewConfig({
          ...view,
          columnOptions: undefined,
        });
      }
    });

    // Offer the source's columns in the column picker. A view config that
    // supplies its own column options keeps them.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

      const columnOptions = this.#pickerColumnOptions();
      const view = this.#findViewConfig();

      if (
        view &&
        view.columnOptions !== columnOptions &&
        (!view.columnOptions ||
          view.columnOptions === this.#publishedColumnOptions)
      ) {
        this.#publishedColumnOptions = columnOptions;
        this.#dataManagerSvc.updateViewConfig({ ...view, columnOptions });
      }
    });

    // Apply the view's column state to the source, then store what the source
    // displays, which also records columns added or removed since the state
    // was stored. The source is read untracked so that a user reordering
    // columns does not re-run this effect and restore the stored order.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

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
      if (!this.#claimDataView()) {
        return;
      }

      const displayedColumnIds = this.#columnSource.displayedColumnIds();

      untracked(() => {
        const state = this.#reconciledState();

        if (state) {
          this.#storeColumnState(state.columnIds, displayedColumnIds);
        }
      });
    });
  }

  /**
   * Whether this directive controls its data view's columns, decided when its
   * effects first run. Deciding then rather than at construction lets a grid
   * that is created before the grid it replaces is destroyed, such as by a
   * `@for` block, take over the data view.
   */
  #claimDataView(): boolean {
    if (this.#controlsDataView === undefined) {
      this.#controlsDataView = !CONTROLLED_DATA_VIEWS.has(this.#dataView);

      if (this.#controlsDataView) {
        CONTROLLED_DATA_VIEWS.add(this.#dataView);
      } else {
        this.#logger.warn(
          'A data view can have only one `skyDataManagerColumnController`. Only the first one controls the columns.',
        );
      }
    }

    return this.#controlsDataView;
  }

  #findViewConfig(): SkyDataViewConfig | undefined {
    const viewId = this.#dataView.viewId;
    return this.#viewConfigs().find((config) => config.id === viewId);
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
