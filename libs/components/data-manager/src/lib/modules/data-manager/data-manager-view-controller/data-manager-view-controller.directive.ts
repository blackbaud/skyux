import {
  DestroyRef,
  Directive,
  computed,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyLogService, SkyMediaQueryService } from '@skyux/core';
import {
  SkyDataColumnSource,
  SkyDataSelectionSource,
  SkyDataSort,
  SkyDataSortSource,
} from '@skyux/lists';

import { map } from 'rxjs';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataViewComponent } from '../data-view.component';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewColumnWidths } from '../models/data-view-column-widths';
import { SkyDataViewConfig } from '../models/data-view-config';
import { SkyDataViewState } from '../models/data-view-state';

import {
  SkyDataManagerColumnState,
  reconcileColumnState,
} from './data-manager-column-state';

const SOURCE_ID = 'skyDataManagerViewController';

// The data views that a view controller controls. A data view stores a single
// column layout and set of column widths, so only one view controller can
// control it.
const CONTROLLED_DATA_VIEWS = new WeakSet<SkyDataViewComponent>();

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

function columnWidthsEqual(
  a: Readonly<Record<string, number>>,
  b: Readonly<Record<string, number>>,
): boolean {
  const keys = Object.keys(a);
  return (
    keys.length === Object.keys(b).length &&
    keys.every((key) => a[key] === b[key])
  );
}

/**
 * Connects a `sky-data-grid` to the data manager of the `sky-data-view` that
 * contains it. The data manager's column picker offers the grid's columns and
 * controls which of them display, and the columns users display, reorder, and
 * resize are stored in the view state, so the view config does not need to
 * supply `columnOptions`. Set `columnPickerEnabled` on the view config to
 * display the column picker. The column users sort by and the rows they select
 * are stored in the data state, including selected rows that a search or
 * filter hides. The grid's sort comes from the data state, so set a default
 * sort with the `activeSortOption` of the `defaultDataState` that initializes
 * the data manager rather than with the grid's `sort` input. The data manager
 * also keeps the grid's column headers visible beneath its toolbar while the
 * page scrolls.
 * @preview
 */
@Directive({ selector: '[skyDataManagerViewController]' })
export class SkyDataManagerViewControllerDirective {
  readonly #columnSource = inject(SkyDataColumnSource, { self: true });
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataView = inject(SkyDataViewComponent);
  readonly #logger = inject(SkyLogService);
  readonly #selectionSource = inject(SkyDataSelectionSource, { self: true });
  readonly #sortSource = inject(SkyDataSortSource, { self: true });

  // Inside a data view, this is the data view's own breakpoint, which it
  // reports only once it renders.
  readonly #breakpoint = toSignal(
    inject(SkyMediaQueryService).breakpointChange.pipe(
      map((breakpoint): keyof SkyDataViewColumnWidths =>
        breakpoint === 'xs' ? 'xs' : 'sm',
      ),
    ),
  );

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

  /**
   * The column widths the view stores for the current breakpoint. This is
   * `undefined` until both the data state and the breakpoint are known.
   */
  readonly #storedColumnWidths = computed(() => {
    const breakpoint = this.#breakpoint();
    const dataState = this.#dataState();
    const viewId = this.#dataView.viewId;

    if (!breakpoint || !dataState || !viewId) {
      return undefined;
    }

    return {
      breakpoint,
      columnWidths:
        dataState.getViewStateById(viewId)?.columnWidths[breakpoint] ?? {},
    };
  });

  #controlsDataView: boolean | undefined;
  #publishedColumnOptions: SkyDataManagerColumnPickerOption[] | undefined;
  #selectionSeeded = false;

  constructor() {
    // Withdraw the published column options so that a view controller created
    // later, such as when the grid is recreated, publishes its own.
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

    // Keep the source's column headers visible beneath the data manager's
    // toolbar while the page scrolls. The source would otherwise keep them
    // visible itself, at the top of the viewport over the toolbar.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

      const viewId = this.#dataView.viewId;
      const viewkeeperClasses = this.#columnSource.viewkeeperClasses();

      if (viewId) {
        untracked(() => this.#columnSource.disableViewkeeper());
        this.#dataManagerSvc.setViewkeeperClasses(viewId, [
          ...viewkeeperClasses,
        ]);
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

    // Apply the data state's sort to the source. The data state is the only
    // source of the sort, so a sort the source starts with is replaced, and a
    // sort the user clears stays cleared when the state is restored.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

      const dataState = this.#dataState();
      const columnOptions = this.#columnSource.columnOptions();

      if (!dataState || !this.#dataView.viewId) {
        return;
      }

      // A sort by a property the source has no column for, such as one chosen
      // in another view, cannot be shown, so the source shows no sort.
      const sortOption = dataState.activeSortOption;
      const sort: SkyDataSort | undefined =
        sortOption &&
        columnOptions.some((column) => column.id === sortOption.propertyName)
          ? {
              direction: sortOption.descending ? 'desc' : 'asc',
              field: sortOption.propertyName,
            }
          : undefined;

      untracked(() => this.#sortSource.setSort(sort));
    });

    // Store the sort the user applies in the source by sorting a column.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

      const sort = this.#sortSource.sort();

      untracked(() => this.#storeSort(sort));
    });

    // Apply the data state's selection to the source. The first data state
    // without a selection stores the selection the source starts with instead.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

      // Keep rows selected while a search or filter hides them.
      untracked(() => this.#selectionSource.disableSelectionPruning());

      const dataState = this.#dataState();

      if (
        !this.#selectionSource.multiselect() ||
        !dataState ||
        !this.#dataView.viewId
      ) {
        return;
      }

      const selectedIds = dataState.selectedIds;

      untracked(() => {
        if (!this.#selectionSeeded) {
          this.#selectionSeeded = true;

          if (!selectedIds) {
            this.#storeSelectedRowIds(this.#selectionSource.selectedRowIds());
            return;
          }
        }

        this.#selectionSource.setSelectedRowIds(selectedIds ?? []);
      });
    });

    // Store the rows the user selects in the source.
    effect(() => {
      if (!this.#claimDataView() || !this.#selectionSource.multiselect()) {
        return;
      }

      const selectedRowIds = this.#selectionSource.selectedRowIds();

      untracked(() => this.#storeSelectedRowIds(selectedRowIds));
    });

    // Apply the column widths the view stores for the current breakpoint,
    // including when the breakpoint changes.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

      const stored = this.#storedColumnWidths();

      if (stored) {
        untracked(() =>
          this.#columnSource.setColumnWidths(stored.columnWidths),
        );
      }
    });

    // Store the column widths the user sets in the source for the current
    // breakpoint.
    effect(() => {
      if (!this.#claimDataView()) {
        return;
      }

      const columnWidths = this.#columnSource.columnWidths();

      untracked(() => {
        const stored = this.#storedColumnWidths();

        if (stored) {
          this.#storeState((_, viewState) => {
            if (
              columnWidthsEqual(
                viewState.columnWidths[stored.breakpoint],
                columnWidths,
              )
            ) {
              return false;
            }

            viewState.columnWidths[stored.breakpoint] = { ...columnWidths };
            return true;
          });
        }
      });
    });
  }

  /**
   * Whether this directive controls its data view, decided when its effects
   * first run. Deciding then rather than at construction lets a grid that is
   * created before the grid it replaces is destroyed, such as by a `@for`
   * block, take over the data view.
   */
  #claimDataView(): boolean {
    if (this.#controlsDataView === undefined) {
      this.#controlsDataView = !CONTROLLED_DATA_VIEWS.has(this.#dataView);

      if (this.#controlsDataView) {
        CONTROLLED_DATA_VIEWS.add(this.#dataView);
      } else {
        this.#logger.warn(
          'A data view can have only one `skyDataManagerViewController`. Only the first one controls the view.',
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
    this.#storeState((_, viewState) => {
      if (
        arraysEqual(viewState.columnIds, columnIds) &&
        arraysEqual(viewState.displayedColumnIds, displayedColumnIds)
      ) {
        return false;
      }

      viewState.columnIds = columnIds;
      viewState.displayedColumnIds = [...displayedColumnIds];
      return true;
    });
  }

  #storeSelectedRowIds(selectedRowIds: readonly string[]): void {
    this.#storeState((dataState) => {
      // No stored selection is the same as an empty one, so a source that
      // starts with no rows selected stores nothing.
      if (arraysEqual(dataState.selectedIds ?? [], selectedRowIds)) {
        return false;
      }

      dataState.selectedIds = [...selectedRowIds];
      return true;
    });
  }

  #storeSort(sort: SkyDataSort | undefined): void {
    const columnOptions = this.#columnSource.columnOptions();

    this.#storeState((dataState) => {
      const sortOption = dataState.activeSortOption;

      if (sort) {
        // Compare what the sort does rather than the whole option, so that a
        // stored option keeps its own ID and label.
        if (
          sortOption?.propertyName === sort.field &&
          !!sortOption.descending === (sort.direction === 'desc')
        ) {
          return false;
        }
      } else if (
        !sortOption ||
        !columnOptions.some((column) => column.id === sortOption.propertyName)
      ) {
        // The source cannot show a sort by a property it has no column for,
        // so its having no sort does not clear that sort.
        return false;
      }

      dataState.activeSortOption = sort && {
        descending: sort.direction === 'desc',
        id: sort.field,
        label:
          columnOptions.find((column) => column.id === sort.field)?.labelText ??
          sort.field,
        propertyName: sort.field,
      };
      return true;
    });
  }

  /**
   * Publishes a copy of the data state that `change` updates, along with the
   * data view's state. `change` returns whether it changed anything, so a
   * state that already holds the value is not published again.
   */
  #storeState(
    change: (
      dataState: SkyDataManagerState,
      viewState: SkyDataViewState,
    ) => boolean,
  ): void {
    const dataState = this.#dataState();
    const viewId = this.#dataView.viewId;

    if (!dataState || !viewId) {
      return;
    }

    const updatedDataState = new SkyDataManagerState(
      dataState.getStateOptions(),
    );
    const viewState = new SkyDataViewState(
      (
        dataState.getViewStateById(viewId) ?? new SkyDataViewState({ viewId })
      ).getViewStateOptions(),
    );

    if (change(updatedDataState, viewState)) {
      this.#dataManagerSvc.updateDataState(
        updatedDataState.addOrUpdateView(viewId, viewState),
        SOURCE_ID,
      );
    }
  }
}
