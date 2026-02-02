import {
  Directive,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyDataHost, SkyDataHostService } from '@skyux/lists';

import { filter, map, switchMap } from 'rxjs';

import { SkyDataManagerFilterControllerDirective } from '../data-manager-filters/data-manager-filter-controller.directive';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerSortOption } from '../models/data-manager-sort-option';
import { SkyDataManagerState } from '../models/data-manager-state';

import { SkyDataManagerHostService } from './data-manager-host.service';

/**
 * A directive applied to a data-displaying component (like `sky-data-grid`) that enables integration with a data manager.
 * This directive synchronizes the component's data state with the data manager's state, including displayed columns,
 * sort order, current page, and selected rows.
 */
@Directive({
  selector: '[skyDataManagerHostController]',
  providers: [
    SkyDataManagerHostService,
    {
      provide: SkyDataHostService,
      useExisting: SkyDataManagerHostService,
    },
  ],
  hostDirectives: [SkyDataManagerFilterControllerDirective],
})
export class SkyDataManagerHostControllerDirective {
  /**
   * The view ID for the data view in the data manager.
   * @required
   */
  public readonly viewId = input.required<string>();

  readonly #sourceId = 'skyDataManagerHostController';
  readonly #dataManagerSourceId = computed(
    () => `${this.#sourceId}--${this.viewId()}`,
  );
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #dataManagerSortOptions = toSignal<
    SkyDataManagerSortOption[],
    SkyDataManagerSortOption[]
  >(
    this.#dataManagerService
      .getDataManagerConfigUpdates()
      .pipe(map((options) => options.sortOptions ?? [])),
    { initialValue: [] },
  );
  readonly #dataManagerState = toSignal(
    toObservable(this.#dataManagerSourceId).pipe(
      filter(Boolean),
      switchMap((sourceId) =>
        this.#dataManagerService.getDataStateUpdates(sourceId),
      ),
    ),
    { initialValue: new SkyDataManagerState({}) },
  );
  readonly #adapterService = inject(SkyDataManagerHostService);
  readonly #dataHostState = toSignal(
    this.#adapterService.getDataHostUpdates(this.#sourceId),
  );

  constructor() {
    effect(() => {
      const dataManagerState = this.#dataManagerState();
      const dataHost = untracked(() => this.#dataHostState());
      const newState = this.#dataHostStateFromDataManagerState(
        dataManagerState,
        dataHost,
      );
      if (newState) {
        this.#adapterService.updateDataHost(newState, this.#sourceId);
      }
    });
    effect(() => {
      const dataManagerState = untracked(() => this.#dataManagerState());
      const dataHost = this.#dataHostState();
      if (dataManagerState && dataHost) {
        const newDataManagerState = this.#dataManagerStateFromDataHostState(
          dataManagerState,
          dataHost,
        );
        this.#dataManagerService.updateDataState(
          newDataManagerState,
          this.#dataManagerSourceId(),
        );
      }
    });
  }

  #dataHostStateFromDataManagerState(
    dataState: SkyDataManagerState,
    dataHost: SkyDataHost | undefined,
  ): SkyDataHost | undefined {
    const viewId = this.viewId();
    const viewState = dataState.getViewStateById(viewId);

    if (viewState) {
      return {
        activeSortOption: dataState.activeSortOption
          ? {
              propertyName: dataState.activeSortOption.propertyName,
              descending: dataState.activeSortOption.descending,
            }
          : undefined,
        displayedColumnIds:
          viewState.displayedColumnIds.length > 0
            ? viewState.displayedColumnIds
            : (dataHost?.displayedColumnIds ?? []),
        id: viewId,
        page: viewState.additionalData?.page ?? dataHost?.page ?? 1,
        searchText: dataState.searchText,
        selectedIds: dataState.selectedIds,
      };
    }
    return undefined;
  }

  #dataManagerStateFromDataHostState(
    dataState: SkyDataManagerState,
    dataHost: SkyDataHost,
  ): SkyDataManagerState {
    const viewId = this.viewId();
    const newDataState = new SkyDataManagerState(dataState);
    newDataState.activeSortOption = this.#dataManagerSortOptions().find(
      (option) =>
        option.propertyName === dataHost.activeSortOption?.propertyName,
    );
    if (newDataState.activeSortOption) {
      newDataState.activeSortOption.descending =
        !!dataState.activeSortOption?.descending;
    }
    newDataState.searchText = dataState.searchText;

    const viewState = newDataState.getViewStateById(viewId);
    if (viewState) {
      viewState.displayedColumnIds = dataHost.displayedColumnIds;
      viewState.additionalData ??= {};
      viewState.additionalData.page = dataHost.page;
    }

    return newDataState;
  }
}
