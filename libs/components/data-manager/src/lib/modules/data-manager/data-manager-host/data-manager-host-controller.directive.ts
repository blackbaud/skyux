import {
  Directive,
  computed,
  effect,
  inject,
  input,
  linkedSignal,
  untracked,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { SkyDataHost, SkyDataHostService } from '@skyux/lists';

import { filter, map, switchMap } from 'rxjs';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerSortOption } from '../models/data-manager-sort-option';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewState } from '../models/data-view-state';

import { SkyDataManagerHostService } from './data-manager-host.service';

/**
 * A directive applied to `sky-data-view` when data-displaying component (like `sky-data-grid`) that enables integration
 * with a data manager. This directive synchronizes the component's data state with the data manager's state, including
 * displayed columns, sort order, current page, and selected rows.
 */
@Directive({
  selector: 'sky-data-view[skyDataManagerHostController]',
  providers: [
    SkyDataManagerHostService,
    {
      provide: SkyDataHostService,
      useExisting: SkyDataManagerHostService,
    },
  ],
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
  readonly #lastSentDataHost = linkedSignal(() => this.#dataHostState());
  readonly #lastSentDataManagerState = linkedSignal(() =>
    this.#dataManagerState(),
  );

  constructor() {
    effect(() => {
      const dataManagerState = this.#dataManagerState();
      const lastSentDataHost = untracked(() => this.#lastSentDataHost());
      const newState = this.#dataHostStateFromDataManagerState(
        dataManagerState,
        lastSentDataHost,
      );
      if (
        newState &&
        (!lastSentDataHost ||
          this.#dataHostHasChanges(lastSentDataHost, newState))
      ) {
        this.#lastSentDataHost.set(newState);
        this.#adapterService.updateDataHost(newState, this.#sourceId);
      }
    });
    effect(() => {
      const lastSentDataManagerState = untracked(() =>
        this.#lastSentDataManagerState(),
      );
      const dataHost = this.#dataHostState();
      if (lastSentDataManagerState && dataHost) {
        const newDataManagerState = this.#dataManagerStateFromDataHostState(
          lastSentDataManagerState,
          dataHost,
        );
        if (
          this.#dataManagerStateHasChanges(
            lastSentDataManagerState,
            newDataManagerState,
          )
        ) {
          this.#lastSentDataManagerState.set(newDataManagerState);
          this.#dataManagerService.updateDataState(
            newDataManagerState,
            this.#dataManagerSourceId(),
          );
        }
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
        page: Number(viewState.additionalData?.page ?? dataHost?.page ?? 1),
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
    const id = this.viewId();
    const activeSortOption = this.#dataManagerSortOptions().find(
      (option) =>
        option.propertyName === dataHost.activeSortOption?.propertyName &&
        option.descending === !!dataHost.activeSortOption?.descending,
    );
    const viewState = dataState.getViewStateById(id);
    return new SkyDataManagerState({
      ...dataState,
      activeSortOption,
      searchText: dataHost.searchText,
      selectedIds: dataHost.selectedIds,
      views: [
        ...dataState.views.filter(({ viewId }) => viewId !== id),
        new SkyDataViewState({
          viewId: id,
          columnIds: viewState?.columnIds,
          columnWidths: viewState?.columnWidths,
          displayedColumnIds: dataHost.displayedColumnIds,
          additionalData: {
            ...(viewState?.additionalData ?? {}),
            page: dataHost.page,
          },
        }),
      ],
    });
  }

  #dataHostHasChanges(
    oldDataHost: SkyDataHost,
    newDataHost: SkyDataHost,
  ): boolean {
    return (
      String(oldDataHost.activeSortOption?.propertyName) !==
        String(newDataHost.activeSortOption?.propertyName) ||
      !!oldDataHost.activeSortOption?.descending !==
        !!newDataHost.activeSortOption?.descending ||
      oldDataHost.id !== newDataHost.id ||
      Number(oldDataHost.page) !== Number(newDataHost.page) ||
      String(oldDataHost.searchText) !== String(newDataHost.searchText) ||
      oldDataHost.displayedColumnIds.length !==
        newDataHost.displayedColumnIds.length ||
      oldDataHost.displayedColumnIds.some(
        (id, idx) => String(id) !== String(newDataHost.displayedColumnIds[idx]),
      ) ||
      Number(oldDataHost.selectedIds?.length) !==
        Number(newDataHost.selectedIds?.length) ||
      !!oldDataHost.selectedIds?.some(
        (id, idx) => id !== newDataHost.selectedIds?.[idx],
      )
    );
  }

  #dataManagerStateHasChanges(
    oldDataManagerState: SkyDataManagerState,
    newDataManagerState: SkyDataManagerState,
  ): boolean {
    const viewId = this.viewId();
    const oldDataViewState = oldDataManagerState.getViewStateById(viewId);
    const newDataViewState = newDataManagerState.getViewStateById(viewId);
    return (
      String(oldDataManagerState.activeSortOption?.propertyName) !==
        String(newDataManagerState.activeSortOption?.propertyName) ||
      !!oldDataManagerState.activeSortOption?.descending !==
        !!newDataManagerState.activeSortOption?.descending ||
      !!oldDataViewState?.additionalData !==
        !!newDataViewState?.additionalData ||
      Number(oldDataViewState?.additionalData?.page) !==
        Number(newDataViewState?.additionalData?.page) ||
      String(oldDataManagerState.searchText) !==
        String(newDataManagerState.searchText) ||
      Number(oldDataManagerState.selectedIds?.length ?? 0) !==
        Number(newDataManagerState.selectedIds?.length ?? 0) ||
      !!oldDataManagerState.selectedIds?.some(
        (id, idx) =>
          String(id) !== String(newDataManagerState.selectedIds?.[idx]),
      ) ||
      Number(oldDataViewState?.displayedColumnIds?.length) !==
        Number(newDataViewState?.displayedColumnIds?.length) ||
      !!oldDataViewState?.displayedColumnIds?.some(
        (id, idx) => id !== newDataViewState?.displayedColumnIds?.[idx],
      )
    );
  }
}
