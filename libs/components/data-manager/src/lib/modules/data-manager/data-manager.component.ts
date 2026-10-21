import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ModelSignal,
  OnDestroy,
  OnInit,
  Signal,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  untracked,
} from '@angular/core';
import { SkyLiveAnnouncerService, SkyViewkeeperModule } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';
import {
  SkyBackToTopMessage,
  SkyBackToTopMessageType,
  SkyBackToTopModule,
} from '@skyux/layout';
import { SkyFilterState } from '@skyux/lists';

import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyDataManagerTemplateConfigDirective } from './data-manager-template-config.directive';
import { SkyDataManagerService } from './data-manager.service';
import { SkyDataManagerSortOption } from './models/data-manager-sort-option';
import { SkyDataManagerState } from './models/data-manager-state';
import { SkyDataManagerStateOptions } from './models/data-manager-state-options';
import { SkyDataManagerSummary } from './models/data-manager-summary';
import { SkyDataViewConfig } from './models/data-view-config';
import { SkyDataManagerDockType } from './types/data-manager-dock-type';

const VIEWKEEPER_CLASSES_DEFAULT = ['.sky-data-manager-toolbar'];
const DEFAULT_DOCK_TYPE: SkyDataManagerDockType = 'none';

/**
 * The top-level data manager component. When `labelText` is set, the data manager provides
 * its own `SkyDataManagerService` and configures itself from its inputs and models, so
 * `initDataManager()` and `initDataView()` are not needed: each `sky-data-view` registers
 * itself, and the first one registered becomes the active view. Otherwise, provide
 * `SkyDataManagerService` at this level and configure the data manager with
 * `initDataManager()`; the models then only reflect and push subsequent state changes.
 */
@Component({
  selector: 'sky-data-manager',
  templateUrl: './data-manager.component.html',
  styleUrl: './data-manager.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SkyBackToTopModule, SkyViewkeeperModule],
})
export class SkyDataManagerComponent implements OnDestroy, OnInit {
  public get currentViewkeeperClasses(): string[] {
    return this.#_currentViewkeeperClasses;
  }

  public set currentViewkeeperClasses(value: string[] | undefined) {
    this.#_currentViewkeeperClasses = [
      ...VIEWKEEPER_CLASSES_DEFAULT,
      ...(value || []),
    ];
    this.#changeDetection.markForCheck();
  }

  public get isInitialized(): boolean {
    return this.#_isInitialized;
  }

  public set isInitialized(value: boolean) {
    this.#_isInitialized = value;
    this.#changeDetection.markForCheck();
  }

  /**
   * How the data manager docks to the page. Use `fill` to dock the data manager
   * to the container's size where the container is a `sky-page` component with
   * its `layout` set to `fit`, or where the container is another element with
   * a `relative` or `absolute` position and a fixed size.
   * `sky-data-manager-toolbar` will be docked to the top of all other content.
   * @default "none"
   */
  public readonly dock = input<SkyDataManagerDockType>(DEFAULT_DOCK_TYPE);

  /**
   * The key to use for storing and retrieving the data state from `SkyUIConfigService`.
   * Ignored unless `labelText` is set; otherwise, pass `settingsKey` to
   * `initDataManager()` instead.
   * @preview
   */
  public readonly settingsKey = input<string>();

  /**
   * The label for the list descriptor in `sky-data-manager-toolbar`. Setting it makes the
   * data manager provide its own `SkyDataManagerService` and configure itself from its
   * template, so do not also call `initDataManager()`. To configure the data manager
   * with `initDataManager()`, set `listDescriptor` on its `SkyDataManagerConfig` instead.
   * @preview
   */
  public readonly labelText = input<string>();

  /**
   * The total number of items matching the current search, sort, and filters, used to
   * announce the data summary to screen readers.
   * @default 0
   * @preview
   */
  public readonly totalCount = input<number>(0);

  /**
   * The current search text.
   * @preview
   */
  public readonly searchText = model<string>('');

  /**
   * The current sort option.
   * @preview
   */
  public readonly sort = model<SkyDataManagerSortOption | undefined>(undefined);

  /**
   * The current filter state. Kept in sync with a `sky-filter-bar` that uses the
   * `skyDataManagerFilterController` directive.
   * @preview
   */
  public readonly filters = model<SkyFilterState | undefined>(undefined);

  /**
   * The IDs of the currently selected rows or objects.
   * @preview
   */
  public readonly selectedIds = model<string[]>([]);

  /**
   * Fires when the data state changes from any source.
   * @preview
   */
  public readonly stateChange = output<SkyDataManagerState>();

  protected readonly dockClass = computed(() => {
    return 'sky-data-manager-dock-' + (this.dock() || DEFAULT_DOCK_TYPE);
  });

  public backToTopController = new Subject<SkyBackToTopMessage>();

  public backToTopOptions = {
    buttonHidden: true,
  };

  #activeViewId: string | undefined;
  #allViewkeeperClasses: Record<string, string[]> = {};
  #ngUnsubscribe = new Subject<void>();
  #sourceId = 'dataManagerComponent';
  // Pushes from this component's models use a different source than `#sourceId`
  // so this component's own state and summary subscriptions still receive them.
  #templateSourceId = 'dataManagerTemplate';
  #dataState: SkyDataManagerState | undefined;
  #hasRegisteredView = false;

  #_isInitialized = false;
  #_currentViewkeeperClasses = VIEWKEEPER_CLASSES_DEFAULT;

  readonly #changeDetection = inject(ChangeDetectorRef);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #liveAnnouncer = inject(SkyLiveAnnouncerService);
  readonly #resourceSvc = inject(SkyLibResourcesService);

  // Without `labelText`, the service comes from the consumer, who owns its
  // initialization through `initDataManager()` and `initDataView()`, possibly
  // asynchronously, so initializing from this component's inputs would conflict with it.
  readonly #ownsService = !!inject(SkyDataManagerTemplateConfigDirective, {
    self: true,
    optional: true,
  });

  // Incoming state is applied to the models and emitted from an effect rather
  // than from the state subscription, which can fire synchronously during the
  // consumer's change detection and trip `ExpressionChangedAfterItHasBeenCheckedError`.
  readonly #incomingState = signal<SkyDataManagerState | undefined>(undefined);

  constructor() {
    this.#pushOnChange(this.labelText, (listDescriptor) => {
      if (this.#ownsService) {
        this.#dataManagerService.updateDataManagerConfig({
          ...this.#dataManagerService.getCurrentDataManagerConfig(),
          listDescriptor,
        });
      }
    });
    this.#pushOnChange(this.searchText, (value) =>
      this.#pushStateField('searchText', value),
    );
    this.#pushOnChange(this.sort, (value) =>
      this.#pushStateField('activeSortOption', value),
    );
    this.#pushOnChange(this.filters, (filters) => {
      // `#applyStateToModels()` mirrors incoming `filterData.filters` into this
      // model. Re-deriving `filtersApplied` from that echo would overwrite a value
      // set through `SkyDataViewConfig.filterModalComponent`, whose filter shape
      // has no `appliedFilters` array.
      const current = this.#dataManagerService.state().filterData?.filters;

      if (JSON.stringify(current) === JSON.stringify(filters)) {
        return;
      }

      this.#pushStateField('filterData', this.#toFilterData(filters));
    });
    this.#pushOnChange(this.selectedIds, (value) =>
      this.#pushStateField('selectedIds', value),
    );
    this.#pushOnChange(this.totalCount, (value) =>
      this.#dataManagerService.updateDataSummary(
        { totalItems: value, itemsMatching: value },
        this.#templateSourceId,
      ),
    );

    effect(() => {
      const state = this.#incomingState();

      if (state) {
        this.#applyStateToModels(state);
        this.stateChange.emit(state);
      }
    });
  }

  public ngOnInit(): void {
    this.#dataManagerService
      .getDataStateUpdates(this.#sourceId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((state) => {
        this.isInitialized = true;
        this.#dataState = state;
        this.#incomingState.set(state);
      });

    this.#dataManagerService
      .getDataSummaryUpdates(this.#sourceId)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((summary: SkyDataManagerSummary) => {
        const itemsSelected = this.#dataState?.selectedIds?.length || 0;
        const resourceString = `skyux_data_manager_status_update_${
          this.#dataState?.onlyShowSelected
            ? 'only_selected'
            : itemsSelected
              ? 'with_selections'
              : 'without_selections'
        }`;

        this.#announceState(
          resourceString,
          summary.itemsMatching,
          summary.totalItems,
          itemsSelected,
        );
      });

    this.#dataManagerService.viewkeeperClasses
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((classes) => {
        this.#allViewkeeperClasses = classes;
        this.currentViewkeeperClasses = this.#activeViewId
          ? classes[this.#activeViewId]
          : undefined;
      });

    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        this.#activeViewId = activeViewId;
        this.backToTopController.next({
          type: SkyBackToTopMessageType.BackToTop,
        });
        this.currentViewkeeperClasses =
          this.#allViewkeeperClasses[this.#activeViewId];
      });

    if (this.#ownsService) {
      this.#dataManagerService.initDataManager({
        // No view is active until the first `sky-data-view` registers itself.
        activeViewId: '',
        dataManagerConfig: { listDescriptor: this.labelText() },
        defaultDataState: new SkyDataManagerState({
          searchText: this.searchText(),
          activeSortOption: this.sort(),
          filterData: this.#toFilterData(this.filters()),
          selectedIds: this.selectedIds(),
        }),
        settingsKey: this.settingsKey(),
      });
    }
  }

  /**
   * Registers a `sky-data-view` with the service this component provides when `labelText`
   * is set. The first view registered becomes the active view. Does nothing otherwise,
   * since the consumer registers views with `initDataView()`.
   * @returns Whether this data manager owns the view's template configuration.
   * @internal
   */
  public registerView(viewConfig: SkyDataViewConfig): boolean {
    if (!this.#ownsService) {
      return false;
    }

    this.#dataManagerService.initDataView(viewConfig);

    if (!this.#hasRegisteredView) {
      this.#hasRegisteredView = true;
      this.#dataManagerService.updateActiveViewId(viewConfig.id);
    }

    return true;
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
    if (this.#ownsService) {
      this.#dataManagerService.ngOnDestroy();
    }
  }

  /**
   * Registers an effect that calls `onChange` for every change to `source` after
   * its initial value. The initial values are applied when the data manager and
   * its views are initialized, whether by this component or by the consumer.
   * `onChange` runs untracked because it reads the current data state; tracking
   * that state would re-run the effect on every state change and push the model's
   * value before `#applyStateToModels()` has caught the model up, overwriting the
   * newer state.
   */
  #pushOnChange<T>(source: Signal<T>, onChange: (value: T) => void): void {
    let isFirstRun = true;

    effect(() => {
      const value = source();

      if (isFirstRun) {
        isFirstRun = false;
        return;
      }

      untracked(() => onChange(value));
    });
  }

  /**
   * Pushes `value` for `key` unless it already matches the current state, which
   * keeps the models and the state from updating each other in a loop.
   */
  #pushStateField<K extends keyof SkyDataManagerStateOptions>(
    key: K,
    value: SkyDataManagerStateOptions[K],
  ): void {
    const current = this.#dataManagerService.state().getStateOptions();

    if (
      JSON.stringify(this.#normalizeForCompare(key, current[key])) ===
      JSON.stringify(this.#normalizeForCompare(key, value))
    ) {
      return;
    }

    this.#dataManagerService.updateState({ [key]: value });
  }

  #applyStateToModels(state: SkyDataManagerState): void {
    this.#setIfChanged(this.searchText, state.searchText ?? '');
    this.#setIfChanged(this.sort, state.activeSortOption);
    this.#setIfChanged(
      this.filters,
      state.filterData?.filters as SkyFilterState | undefined,
    );
    this.#setIfChanged(this.selectedIds, state.selectedIds ?? []);
  }

  #setIfChanged<T>(target: ModelSignal<T>, value: T): void {
    if (JSON.stringify(target()) !== JSON.stringify(value)) {
      target.set(value);
    }
  }

  /**
   * Treats an unset state field as equal to the corresponding model's default, so
   * an untouched model never overwrites state.
   */
  #normalizeForCompare<K extends keyof SkyDataManagerStateOptions>(
    key: K,
    value: SkyDataManagerStateOptions[K],
  ): unknown {
    switch (key) {
      case 'searchText':
        return value ?? '';
      case 'selectedIds':
        return value ?? [];
      default:
        return value;
    }
  }

  /**
   * Matches `SkyDataManagerFilterControllerDirective`, which treats filters as
   * applied only when `appliedFilters` is non-empty.
   */
  #toFilterData(
    filters: SkyFilterState | undefined,
  ): SkyDataManagerStateOptions['filterData'] {
    return filters
      ? { filtersApplied: !!filters.appliedFilters?.length, filters }
      : undefined;
  }

  #announceState(
    resourceString: string,
    itemsMatching: number,
    totalItems: number,
    itemsSelected: number,
  ): void {
    this.#resourceSvc
      .getString(resourceString, itemsMatching, totalItems, itemsSelected)
      .pipe(take(1))
      .subscribe((internationalizedString) => {
        this.#liveAnnouncer.announce(internationalizedString);
      });
  }
}
