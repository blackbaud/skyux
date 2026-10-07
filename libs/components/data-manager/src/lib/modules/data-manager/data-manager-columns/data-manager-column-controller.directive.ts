import { Directive, computed, effect, inject, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyDataColumnSource } from '@skyux/lists';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataViewComponent } from '../data-view.component';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewState } from '../models/data-view-state';

import {
  SkyDataManagerColumnState,
  reconcileColumnState,
} from './data-manager-column-state';

const SOURCE_ID = 'skyDataManagerColumnController';

function arraysEqual(a: readonly string[], b: readonly string[]): boolean {
  return a.length === b.length && a.every((value, i) => value === b[i]);
}

/**
 * A directive applied to a column-based component, such as a data grid, that
 * lets a data manager's column picker control which columns display. The
 * columns are read from the component, so the view config does not need to
 * supply column options.
 * @preview
 */
@Directive({ selector: '[skyDataManagerColumnController]' })
export class SkyDataManagerColumnControllerDirective {
  readonly #columnSource = inject(SkyDataColumnSource);
  readonly #dataManagerSvc = inject(SkyDataManagerService);
  readonly #dataView = inject(SkyDataViewComponent);

  readonly #viewId = computed(() => this.#dataView.viewId ?? '');

  readonly #dataState = toSignal(
    this.#dataManagerSvc.getDataStateUpdates(SOURCE_ID + '#dataState'),
  );

  /**
   * The column state stored by the data manager, reconciled against the
   * columns the component currently declares. This is `undefined` until the
   * data manager emits its first state, so a stored column layout is never
   * overwritten by the component's declarative default.
   */
  readonly #reconciledState = computed<SkyDataManagerColumnState | undefined>(
    () => {
      const dataState = this.#dataState();
      const columns = this.#columnSource.dataColumns();

      if (!dataState || columns.length === 0) {
        return undefined;
      }

      return reconcileColumnState(this.#readStoredState(dataState), [
        ...columns,
      ]);
    },
  );

  constructor() {
    // Publish the columns so the column picker can offer them.
    effect(() => {
      const columns = this.#columnSource.dataColumns();
      const viewId = this.#viewId();
      const view = this.#dataManagerSvc.getViewById(viewId);

      // A view that supplies its own column options keeps them.
      if (view && !view.columnOptions) {
        this.#dataManagerSvc.updateViewConfig({
          ...view,
          columnOptions: columns.map((column) => ({
            alwaysDisplayed: column.alwaysDisplayed,
            description: column.description,
            id: column.id,
            initialHide: column.initialHide,
            label: column.labelText,
          })),
        });
      }
    });

    // Apply the data manager's column state to the component. The component
    // may read its own displayed columns while setting them, so the call runs
    // untracked; otherwise a user reordering columns would re-run this effect
    // and restore the stored order.
    effect(() => {
      const reconciled = this.#reconciledState();

      if (reconciled) {
        untracked(() =>
          this.#columnSource.setDisplayedColumnIds(
            reconciled.displayedColumnIds,
          ),
        );
      }
    });

    // Store what the component displays. This covers both the reconciled state
    // applied above, which is a no-op once stored, and changes the user makes
    // in the component itself, such as reordering columns by dragging a header.
    effect(() => {
      const reconciled = this.#reconciledState();
      const displayedColumnIds = this.#columnSource.displayedColumnIds();

      if (reconciled) {
        this.#storeColumnState({
          columnIds: reconciled.columnIds,
          displayedColumnIds: [...displayedColumnIds],
        });
      }
    });
  }

  #readStoredState(
    dataState: SkyDataManagerState,
  ): Partial<SkyDataManagerColumnState> | undefined {
    const viewId = this.#viewId();
    return dataState.getViewStateById(viewId);
  }

  #storeColumnState(state: SkyDataManagerColumnState): void {
    const dataState = this.#dataState();
    const viewId = this.#viewId();

    /* istanbul ignore if: only reachable before the first data state */
    if (!viewId || !dataState) {
      return;
    }

    const stored = this.#readStoredState(dataState);

    const sameColumnIds = arraysEqual(stored?.columnIds ?? [], state.columnIds);
    const sameDisplayedColumnIds = arraysEqual(
      stored?.displayedColumnIds ?? [],
      state.displayedColumnIds,
    );
    if (sameColumnIds && sameDisplayedColumnIds) {
      return;
    }

    const viewState = new SkyDataViewState(
      dataState.getViewStateById(viewId)?.getViewStateOptions() ?? { viewId },
    );

    viewState.columnIds = state.columnIds;
    viewState.displayedColumnIds = state.displayedColumnIds;

    this.#dataManagerSvc.updateDataState(
      dataState.addOrUpdateView(viewId, viewState),
      SOURCE_ID,
    );
  }
}
