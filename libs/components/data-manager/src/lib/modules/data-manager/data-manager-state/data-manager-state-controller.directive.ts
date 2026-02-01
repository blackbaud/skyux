import {
  DestroyRef,
  Directive,
  OnInit,
  effect,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyDataHost } from '@skyux/lists';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewState } from '../models/data-view-state';

/**
 * A directive applied to a data-displaying component (like `sky-data-grid`) that enables integration with a data manager.
 * This directive synchronizes the component's data state with the data manager's state, including displayed columns,
 * sort order, current page, and selected rows.
 */
@Directive({
  selector: '[skyDataManagerStateController]',
})
export class SkyDataManagerStateControllerDirective implements OnInit {
  /**
   * The view ID for the data view in the data manager.
   * @required
   */
  public readonly viewId = input.required<string>();

  /**
   * The data state to synchronize with the data manager. Use this with two-way binding on the
   * component's `dataState` property.
   */
  public readonly dataState = model<SkyDataHost | undefined>(undefined);

  #currentDataState = new SkyDataManagerState({});
  #updatingFromDataManager = false;
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #sourceId = 'skyDataManagerStateController';

  constructor() {
    // Watch for changes to the component's data state and update the data manager
    effect(() => {
      const componentState = this.dataState();
      if (componentState && !this.#updatingFromDataManager) {
        untracked(() => {
          this.#updateDataManagerFromComponent(componentState);
        });
      }
    });
  }

  public ngOnInit(): void {
    // Subscribe to data manager state changes to update the component's data state
    this.#dataManagerService
      .getDataStateUpdates(this.viewId(), { properties: ['views'] })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((dataState: SkyDataManagerState) => {
        this.#currentDataState = dataState;
        this.#updateComponentFromDataManager(dataState);
      });
  }

  /**
   * Updates the component's data state based on the data manager state.
   */
  #updateComponentFromDataManager(dataState: SkyDataManagerState): void {
    this.#updatingFromDataManager = true;
    try {
      const viewId = this.viewId();
      const viewState = dataState.getViewStateById(viewId);

      if (viewState) {
        const newDataState: SkyDataHost = {
          displayedColumnIds: viewState.displayedColumnIds || undefined,
          sort: dataState.activeSortOption
            ? {
                fieldSelector: dataState.activeSortOption.propertyName,
                descending: !!dataState.activeSortOption.descending,
              }
            : undefined,
          page: undefined, // Page is not stored in data manager state
          selectedIds: dataState.selectedIds || undefined,
        };

        // Only update if the state has changed
        const currentState = this.dataState();
        if (
          !currentState ||
          JSON.stringify(currentState) !== JSON.stringify(newDataState)
        ) {
          this.dataState.set(newDataState);
        }
      }
    } finally {
      this.#updatingFromDataManager = false;
    }
  }

  /**
   * Updates the data manager state based on the component's data state changes.
   */
  #updateDataManagerFromComponent(componentState: SkyDataHost): void {
    const viewId = this.viewId();
    const currentViewState =
      this.#currentDataState.getViewStateById(viewId) ||
      new SkyDataViewState({ viewId });

    // Update displayed columns
    if (componentState.displayedColumnIds) {
      currentViewState.displayedColumnIds = componentState.displayedColumnIds;
    }

    // Update the view state
    const updatedState = this.#currentDataState.addOrUpdateView(
      viewId,
      currentViewState,
    );

    // Update sort option
    if (componentState.sort) {
      updatedState.activeSortOption = {
        id: componentState.sort.fieldSelector,
        propertyName: componentState.sort.fieldSelector,
        descending: componentState.sort.descending,
        label: componentState.sort.fieldSelector,
      };
    } else {
      updatedState.activeSortOption = undefined;
    }

    // Update selected IDs
    if (componentState.selectedIds) {
      updatedState.selectedIds = componentState.selectedIds;
    }

    // Update the data manager
    this.#currentDataState = updatedState;
    this.#dataManagerService.updateDataState(updatedState, this.#sourceId);
  }
}
