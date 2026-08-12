import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ModelSignal,
  OnDestroy,
  OnInit,
  afterNextRender,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  isStandalone,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SkyLogService, SkyUIConfigService } from '@skyux/core';
import {
  SkyCheckboxChange,
  SkyCheckboxModule,
  SkyRadioModule,
} from '@skyux/forms';
import { SkyIconModule } from '@skyux/icon';
import { SkyToolbarModule } from '@skyux/layout';
import { SkyFilterModule, SkyFilterState, SkySortModule } from '@skyux/lists';
import { SkySearchModule } from '@skyux/lookup';
import {
  SkyModalCloseArgs,
  SkyModalConfigurationInterface,
  SkyModalLegacyService,
  SkyModalService,
} from '@skyux/modals';

import { Subject, switchMap } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { SkyDataManagerResourcesModule } from '../../shared/sky-data-manager-resources.module';
import { SkyDataManagerColumnPickerContext } from '../data-manager-column-picker/data-manager-column-picker-context';
import { SKY_DATA_MANAGER_COLUMN_PICKER_PROVIDERS } from '../data-manager-column-picker/data-manager-column-picker-providers';
import { SkyDataManagerColumnPickerService } from '../data-manager-column-picker/data-manager-column-picker.service';
import { SkyDataManagerFilterModalContext } from '../data-manager-filter-context';
import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataManagerConfig } from '../models/data-manager-config';
import { SkyDataManagerSortOption } from '../models/data-manager-sort-option';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataManagerStateOptions } from '../models/data-manager-state-options';
import { SkyDataViewConfig } from '../models/data-view-config';

import { SkyDataManagerSortOptionComponent } from './data-manager-sort-option.component';
import { SkyDataManagerToolbarLeftItemComponent } from './data-manager-toolbar-left-item.component';
import { SkyDataManagerToolbarPrimaryItemComponent } from './data-manager-toolbar-primary-item.component';
import { SkyDataManagerToolbarRightItemComponent } from './data-manager-toolbar-right-item.component';
import { SkyDataManagerToolbarSectionComponent } from './data-manager-toolbar-section.component';

/**
 * Renders a `sky-toolbar` with the contents specified by the active view's `SkyDataViewConfig`
 * and the `SkyDataManagerToolbarLeftItemComponent`, `SkyDataManagerToolbarRightItemComponent`,
 * and `SkyDataManagerToolbarSectionComponent` wrappers. Also supports a signal-based API (see
 * the `searchText`, `sort`, `filters`, `page`, `pageSize`, `selectedIds`, and `totalCount`
 * models, and the `settingsKey`/`searchEnabled`/`searchPlaceholderText`/`multiselectEnabled`/
 * `labelText` inputs) as an alternative to the config-driven `SkyDataViewConfig`/
 * `SkyDataManagerConfig` path.
 */
@Component({
  selector: 'sky-data-manager-toolbar',
  templateUrl: './data-manager-toolbar.component.html',
  styleUrls: ['./data-manager-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    SkyCheckboxModule,
    SkyDataManagerResourcesModule,
    SkyIconModule,
    SkyFilterModule,
    SkyRadioModule,
    SkySearchModule,
    SkySortModule,
    SkyToolbarModule,
  ],
})
export class SkyDataManagerToolbarComponent implements OnDestroy, OnInit {
  public get activeView(): SkyDataViewConfig | undefined {
    return this.#_activeView;
  }

  public set activeView(value: SkyDataViewConfig | undefined) {
    this.#_activeView = value;
    this.#changeDetector.markForCheck();
  }

  public get dataManagerConfig(): SkyDataManagerConfig | undefined {
    return this.#_dataManagerConfig;
  }

  public set dataManagerConfig(value: SkyDataManagerConfig | undefined) {
    this.#_dataManagerConfig = value;
    this.#changeDetector.markForCheck();
  }

  public get dataState(): SkyDataManagerState | undefined {
    return this.#_dataState;
  }

  public set dataState(value: SkyDataManagerState | undefined) {
    this.#_dataState = value;
    if (value) {
      this.#dataManagerService.updateDataState(value, this.#_source);
    }
  }

  public get views(): SkyDataViewConfig[] {
    return this.#_views;
  }

  public set views(value: SkyDataViewConfig[]) {
    this.#_views = value;
    this.#changeDetector.markForCheck();
  }

  public onlyShowSelected: boolean | undefined;

  /**
   * The key to use for storing and retrieving this toolbar's data state from
   * `SkyUIConfigService`. Presence alone turns on sticky-settings persistence for
   * the signal-based API — no `initDataManager()` call is needed.
   * @preview
   */
  public readonly settingsKey = input<string>();

  /**
   * Whether to display the search box, for the signal-based API. Ignored when an
   * active view's `SkyDataViewConfig.searchEnabled` is set.
   * @preview
   */
  public readonly searchEnabled = input<boolean>();

  /**
   * Placeholder text for the search box, for the signal-based API. Ignored when an
   * active view's `SkyDataViewConfig.searchPlaceholderText` is set.
   * @preview
   */
  public readonly searchPlaceholderText = input<string>();

  /**
   * Whether to display the multiselect toolbar, for the signal-based API. Ignored
   * when an active view's `SkyDataViewConfig.multiselectToolbarEnabled` is set.
   * @preview
   */
  public readonly multiselectEnabled = input<boolean>();

  /**
   * The label to display for the toolbar's list descriptor, for the signal-based
   * API. Falls back to `dataManagerConfig?.listDescriptor` when unset.
   * @preview
   */
  public readonly labelText = input<string>();

  /**
   * The current search text. Two-way bindable.
   * @preview
   */
  public readonly searchText = model<string>('');

  /**
   * The current sort option. Two-way bindable.
   * @preview
   */
  public readonly sort = model<SkyDataManagerSortOption | undefined>(undefined);

  /**
   * The current filter state. Two-way bindable. Synced automatically when a
   * `sky-filter-bar` with `skyDataManagerFilterController` is projected into this
   * toolbar.
   * @preview
   */
  public readonly filters = model<SkyFilterState | undefined>(undefined);

  /**
   * The current page number. Two-way bindable. Resets to `1` whenever `sort`,
   * `searchText`, or `filters` changes.
   * @default 1
   * @preview
   */
  public readonly page = model<number>(1);

  /**
   * The number of items to display per page. Two-way bindable.
   * @preview
   */
  public readonly pageSize = model<number | undefined>(undefined);

  /**
   * The set of IDs for the currently selected rows or objects. Two-way bindable.
   * @preview
   */
  public readonly selectedIds = model<string[]>([]);

  /**
   * The total number of items matching the current search/sort/filter, set by the
   * consumer (for example, from a `resource()`'s response). Feeds the existing
   * data summary pipeline used for the live-announcer and `sky-list-summary`.
   * @default 0
   * @preview
   */
  public readonly totalCount = model<number>(0);

  protected readonly sortOptions = contentChildren(
    SkyDataManagerSortOptionComponent,
  );

  /**
   * The columns a column controller directive registered when no view config
   * supplies them.
   */
  readonly #registeredColumnOptions = computed<
    SkyDataManagerColumnPickerOption[] | undefined
  >(() => {
    const columns = this.#dataManagerService.columnOptions();

    return columns?.map((column) => ({
      alwaysDisplayed: column.alwaysDisplayed,
      description: column.description,
      id: column.id,
      initialHide: column.initialHide,
      label: column.labelText,
    }));
  });

  /**
   * Whether to display the column picker button. A view config can enable it,
   * or a column controller directive can register the columns directly, which
   * is how consumers who do not register a view enable it.
   */
  protected get columnPickerEnabled(): boolean {
    return (
      !!this.activeView?.columnPickerEnabled ||
      !!this.#registeredColumnOptions()
    );
  }

  protected readonly primaryItems = contentChildren(
    SkyDataManagerToolbarPrimaryItemComponent,
  );
  protected readonly leftItems = contentChildren(
    SkyDataManagerToolbarLeftItemComponent,
  );
  protected readonly rightItems = contentChildren(
    SkyDataManagerToolbarRightItemComponent,
  );
  protected readonly sections = contentChildren(
    SkyDataManagerToolbarSectionComponent,
  );

  /**
   * Whether the main toolbar has any content to display. Used to avoid
   * rendering an empty toolbar when the only projected content is a
   * `sky-filter-bar` or `sky-list-summary`, which render outside the toolbar.
   */
  protected get hasToolbarContent(): boolean {
    return (
      !!this.activeView?.filterButtonEnabled ||
      !!this.activeView?.sortEnabled ||
      this.columnPickerEnabled ||
      !!this.activeView?.searchEnabled ||
      this.searchEnabled() === true ||
      this.sortOptions().length > 0 ||
      (!!this.activeView && this.views.length > 1) ||
      this.primaryItems().length > 0 ||
      this.leftItems().length > 0 ||
      this.rightItems().length > 0 ||
      this.sections().length > 0
    );
  }

  readonly #logger = inject(SkyLogService, { optional: true });

  #ngUnsubscribe = new Subject<void>();

  // the source to provide for data state changes
  #_source = 'toolbar';
  #_activeView: SkyDataViewConfig | undefined;
  #_dataManagerConfig: SkyDataManagerConfig | undefined;
  #_dataState: SkyDataManagerState | undefined;
  #_views: SkyDataViewConfig[] = [];

  // Holds the most recent externally-sourced `SkyDataManagerState`, so it can
  // be applied to this toolbar's models from an `effect()` (see the
  // constructor) instead of directly from the `getDataStateUpdates()`
  // subscription below. Applying it directly from the subscription can run
  // synchronously inside this component's own `ngOnInit()` (for example, in
  // response to an ancestor's `initDataManager()` call made earlier in the
  // same synchronous call stack) --- i.e. in the middle of the very change
  // detection pass that's also checking these models' two-way template
  // bindings --- which trips `ExpressionChangedAfterItHasBeenCheckedError`.
  // Effects are deferred by Angular specifically to avoid that.
  readonly #incomingState = signal<SkyDataManagerState | undefined>(undefined);

  readonly #changeDetector = inject(ChangeDetectorRef);
  readonly #columnPickerService = inject(SkyDataManagerColumnPickerService);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #modalService = inject(SkyModalService);
  readonly #uiConfigService = inject(SkyUIConfigService);

  constructor() {
    // Each of the following effects always runs once immediately upon
    // registration (Angular's standard `effect()` behavior), before this
    // toolbar's own `#seedInitialStateIfNeeded()` (deferred to
    // `afterNextRender()`, see below) has had a chance to reconcile the models
    // with the data manager's actual current state. Without skipping that
    // first automatic run, every model's built-in default (`''`, `[]`, `1`,
    // etc.) would be diffed against whatever state already exists --- which,
    // for any consumer who hasn't bound that particular model, is very likely
    // a mismatch --- and would incorrectly push the default over real state on
    // every render. Only genuine subsequent changes (a two-way binding update,
    // or an internal call like `sortSelected()`/`searchApplied()`) should push.
    this.#pushOnChange(this.searchText, (value) =>
      this.#pushStateField('searchText', value, true),
    );
    this.#pushOnChange(this.sort, (value) =>
      this.#pushStateField('activeSortOption', value, true),
    );
    this.#pushOnChange(this.filters, (filters) =>
      this.#pushStateField(
        'filterData',
        filters
          ? { filtersApplied: this.#deriveFiltersApplied(filters), filters }
          : undefined,
        true,
      ),
    );
    this.#pushOnChange(this.selectedIds, (value) =>
      this.#pushStateField('selectedIds', value, false),
    );
    this.#pushOnChange(this.page, (value) =>
      this.#pushStateField('page', value, false),
    );
    this.#pushOnChange(this.pageSize, (value) =>
      this.#pushStateField('pageSize', value, false),
    );
    this.#pushOnChange(this.totalCount, (value) =>
      this.#dataManagerService.updateDataSummary(
        { totalItems: value, itemsMatching: value },
        this.#_source,
      ),
    );
    effect(() => {
      const state = this.#incomingState();
      if (state) {
        this.#applyStateToModels(state);
      }
    });

    afterNextRender(() => this.#seedInitialStateIfNeeded());
  }

  public ngOnInit(): void {
    this.#dataManagerService
      .getActiveViewIdUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((activeViewId) => {
        /* istanbul ignore else */
        if (activeViewId) {
          this.activeView = this.#dataManagerService.getViewById(activeViewId);
          this.#changeDetector.markForCheck();
        }
      });

    this.#dataManagerService
      .getDataViewsUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((views) => {
        this.views = views;
        if (this.activeView) {
          this.activeView = this.#dataManagerService.getViewById(
            this.activeView.id,
          );
        }
        this.#changeDetector.markForCheck();
      });

    this.#dataManagerService
      .getDataStateUpdates(this.#_source)
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((dataState) => {
        this.#_dataState = dataState;
        this.onlyShowSelected = dataState.onlyShowSelected;
        this.#incomingState.set(dataState);
        this.#changeDetector.markForCheck();
      });

    this.#dataManagerService
      .getDataManagerConfigUpdates()
      .pipe(takeUntil(this.#ngUnsubscribe))
      .subscribe((config) => {
        this.dataManagerConfig = config;
      });
  }

  public ngOnDestroy(): void {
    this.#ngUnsubscribe.next();
    this.#ngUnsubscribe.complete();
  }

  public sortSelected(sortOption: SkyDataManagerSortOption): void {
    this.sort.set(sortOption);
    // Pushed synchronously (in addition to the `sort` model-to-state effect,
    // which is only guaranteed to flush on a later change-detection pass) so
    // that this legacy, config-driven entry point keeps its original,
    // synchronous `updateDataState()` behavior. The effect's equality guard in
    // `#pushStateField` makes its own later, redundant push for this same
    // value a no-op.
    this.#pushStateField('activeSortOption', sortOption, true);
  }

  public onViewChange(viewId: string): void {
    this.#dataManagerService.updateActiveViewId(viewId);
  }

  public searchApplied(text: string): void {
    this.searchText.set(text);
    // See the comment in `sortSelected()` above: pushed synchronously to
    // preserve this legacy entry point's original synchronous behavior.
    this.#pushStateField('searchText', text, true);
  }

  public filterButtonClicked(): void {
    const context = new SkyDataManagerFilterModalContext();
    const filterModal =
      this.dataManagerConfig && this.dataManagerConfig.filterModalComponent;

    context.filterData = this.dataState?.filterData;

    const options: SkyModalConfigurationInterface = {
      providers: [
        { provide: SkyDataManagerFilterModalContext, useValue: context },
      ],
      size: 'large',
    };

    if (filterModal) {
      if (
        !(this.#modalService instanceof SkyModalLegacyService) &&
        !isStandalone(filterModal)
      ) {
        this.#logger?.deprecated(
          'SkyDataManagerConfig.filterModalComponent not standalone',
          {
            deprecationMajorVersion: 9,
            replacementRecommendation: `The SkyDataManagerConfig.filterModalComponent must be a standalone component in order to receive the right dependency injector context.`,
          },
        );
      }
      const modalInstance = this.#modalService.open(filterModal, options);

      modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
        if (this.dataState && result.reason === 'save') {
          this.dataState.filterData = result.data;
          this.#dataManagerService.updateDataState(
            this.dataState,
            this.#_source,
          );
        }
      });
    }
  }

  public openColumnPicker(): void {
    const columnOptions =
      this.activeView?.columnOptions ?? this.#registeredColumnOptions();
    const viewState = this.activeView
      ? this.dataState?.getViewStateById(this.activeView.id)
      : undefined;

    // With a view config, the columns that display are tracked on the view's
    // state; without one, they are tracked on the data state itself.
    const displayedColumnIds = this.activeView
      ? viewState?.displayedColumnIds
      : this.dataState?.displayedColumnIds;

    if (!this.dataState || !columnOptions || !displayedColumnIds) {
      return;
    }

    const context = new SkyDataManagerColumnPickerContext(
      columnOptions,
      displayedColumnIds,
    );

    if (this.activeView?.columnPickerSortStrategy) {
      context.columnPickerSortStrategy =
        this.activeView.columnPickerSortStrategy;
    }

    const options: SkyModalConfigurationInterface = {
      providers: [
        SKY_DATA_MANAGER_COLUMN_PICKER_PROVIDERS,
        {
          provide: SkyDataManagerColumnPickerContext,
          useValue: context,
        },
      ],
    };

    const modalInstance = this.#modalService.open(
      this.#columnPickerService.getComponentType(),
      options,
    );

    modalInstance.closed.subscribe((result: SkyModalCloseArgs) => {
      if (result.reason !== 'save' || !this.dataState) {
        return;
      }

      const selectedIds = result.data.map(
        (col: SkyDataManagerColumnPickerOption) => col.id,
      );

      if (this.activeView && viewState) {
        viewState.displayedColumnIds = selectedIds;
        this.dataState = this.dataState.addOrUpdateView(
          this.activeView.id,
          viewState,
        );
      } else {
        const newState = new SkyDataManagerState(
          this.dataState.getStateOptions(),
        );
        newState.displayedColumnIds = selectedIds;
        this.dataState = newState;
      }
    });
  }

  public selectAll(): void {
    /* istanbul ignore else */
    if (this.activeView?.onSelectAllClick) {
      this.activeView.onSelectAllClick();
    }
  }

  public clearAll(): void {
    /* istanbul ignore else */
    if (this.activeView?.onClearAllClick) {
      this.activeView.onClearAllClick();
    }
  }

  public onOnlyShowSelected(event: SkyCheckboxChange): void {
    if (this.dataState) {
      this.dataState.onlyShowSelected = !!event.checked;
      this.#dataManagerService.updateDataState(this.dataState, this.#_source);
    }
  }

  /**
   * Registers an `effect()` that invokes `onChange` with `model`'s value on
   * every change *except* the first (Angular always runs a fresh `effect()`
   * once immediately upon registration, purely to record its dependencies).
   * Used for the model-to-state sync effects, so a model's own default value
   * is never diffed against and pushed over already-existing data manager
   * state before `#seedInitialStateIfNeeded()` has run.
   */
  #pushOnChange<T>(model: ModelSignal<T>, onChange: (value: T) => void): void {
    let isFirstRun = true;

    effect(() => {
      const value = model();

      if (isFirstRun) {
        isFirstRun = false;
        return;
      }

      onChange(value);
    });
  }

  /**
   * Pushes `value` for `key` into the data manager state, unless it already
   * matches the current state (this equality check is what prevents the
   * model-to-state effects above from looping against the state-to-model sync in
   * `ngOnInit`'s `getDataStateUpdates()` subscription). When `resetPage` is true
   * and the push actually changes something, also resets `page` to `1`.
   */
  #pushStateField<K extends keyof SkyDataManagerStateOptions>(
    key: K,
    value: SkyDataManagerStateOptions[K],
    resetPage: boolean,
  ): void {
    const current = this.#dataManagerService.state().getStateOptions();

    if (
      JSON.stringify(this.#normalizeForCompare(key, current[key])) ===
      JSON.stringify(this.#normalizeForCompare(key, value))
    ) {
      return;
    }

    const partial: Partial<SkyDataManagerStateOptions> = { [key]: value };

    if (resetPage && (current.page ?? 1) !== 1) {
      partial.page = 1;
      this.page.set(1);
    }

    // Pushed via `updateDataState()` (tagged with this toolbar's own `#_source`)
    // rather than the service's public `updateState()` (which always tags pushes
    // with a fixed internal source). Using `#_source` here means the `ngOnInit`
    // `getDataStateUpdates(this.#_source)` subscription below correctly filters
    // out state changes the toolbar itself just caused, consistent with every
    // other state push this component already makes (see `onOnlyShowSelected`,
    // `filterButtonClicked`, `openColumnPicker`), instead of introducing a second,
    // differently-sourced write path that those existing subscribers can't filter.
    // Mutated in place on the existing `#_dataState` object (mirroring the
    // existing `onOnlyShowSelected()` / `filterButtonClicked()` /
    // `openColumnPicker()` pattern of mutating `this.dataState` before
    // pushing), rather than replacing `#_dataState` with a new object,
    // because the `getDataStateUpdates()` subscription in `ngOnInit()`
    // filters out updates sourced from `this.#_source` --- i.e. this
    // toolbar's own pushes --- so it never reflects this change back into
    // `#_dataState` on its own. Any existing reference to `this.dataState`
    // a consumer is holding needs to observe this change the same way it
    // always could for those other methods.
    const dataState = this.#_dataState ?? new SkyDataManagerState(current);
    Object.assign(dataState, partial);
    this.#_dataState = dataState;
    this.#dataManagerService.updateDataState(dataState, this.#_source);
  }

  /**
   * Reflects an incoming `SkyDataManagerState` (from any source) into this
   * toolbar's models, skipping fields that already match to avoid re-triggering
   * the model-to-state effects above.
   */
  #applyStateToModels(state: SkyDataManagerState): void {
    this.#setIfChanged(this.searchText, state.searchText ?? '');
    this.#setIfChanged(this.sort, state.activeSortOption);
    this.#setIfChanged(
      this.filters,
      state.filterData?.filters as SkyFilterState | undefined,
    );
    this.#setIfChanged(this.selectedIds, state.selectedIds ?? []);
    this.#setIfChanged(this.page, state.page ?? 1);
    if (state.pageSize !== undefined) {
      this.#setIfChanged(this.pageSize, state.pageSize);
    }
  }

  /**
   * Derives whether filters are considered "applied" from a `SkyFilterState`,
   * matching `SkyDataManagerFilterControllerDirective#updateDataManagerFromAdapter()`'s
   * derivation (a non-empty `appliedFilters` array), rather than treating any
   * truthy `filters` object --- including one with an empty `appliedFilters`
   * array, or none at all --- as "applied".
   */
  #deriveFiltersApplied(filters: SkyFilterState | undefined): boolean {
    return !!(filters?.appliedFilters && filters.appliedFilters.length > 0);
  }

  #setIfChanged<T>(model: ModelSignal<T>, value: T): void {
    if (JSON.stringify(model()) !== JSON.stringify(value)) {
      model.set(value);
    }
  }

  /**
   * Normalizes `value` for `key` so that an unset `SkyDataManagerStateOptions`
   * field (`undefined`) compares equal to the corresponding model's own
   * built-in default (`''`, `[]`, or `1`). Without this, a model that was
   * never explicitly touched would still be diffed, as its concrete default,
   * against `undefined` in state that has genuinely never been set --- always
   * finding a "difference" and pushing that default over real state on every
   * render, for every consumer regardless of whether they use these models.
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
      case 'page':
        return value ?? 1;
      default:
        return value;
    }
  }

  /**
   * Seeds the data manager state from this toolbar's own inputs/models (or from
   * persisted `settingsKey` state), but only if `initDataManager()` was never
   * called for this service instance. Deferred to `afterNextRender()` so it runs
   * after any ancestor component's `ngOnInit` (where `initDataManager()` is
   * typically called) has already executed.
   */
  #seedInitialStateIfNeeded(): void {
    if (this.#dataManagerService.isInitialized) {
      return;
    }

    const settingsKey = this.settingsKey();
    const defaultOptions: SkyDataManagerStateOptions = {
      searchText: this.searchText(),
      activeSortOption: this.sort(),
      filterData: this.filters()
        ? {
            filtersApplied: this.#deriveFiltersApplied(this.filters()),
            filters: this.filters(),
          }
        : undefined,
      selectedIds: this.selectedIds(),
      page: this.page(),
      pageSize: this.pageSize(),
    };

    if (settingsKey) {
      this.#uiConfigService
        .getConfig(settingsKey, defaultOptions)
        .pipe(take(1))
        .subscribe((config) => {
          this.#dataManagerService.updateState(config);
        });

      this.#dataManagerService
        .getDataStateUpdates(this.#_source)
        .pipe(
          takeUntil(this.#ngUnsubscribe),
          switchMap((state) =>
            this.#uiConfigService.setConfig(
              settingsKey,
              state.getStateOptions(),
            ),
          ),
        )
        .subscribe({
          error: (err) => {
            console.warn('Could not save data manager toolbar settings.');
            console.warn(err);
          },
        });
    } else {
      // Pushed field-by-field (through the same `#pushStateField()` used by
      // the model-to-state effects, including its normalized equality guard)
      // rather than as one `updateState(defaultOptions)` call. A consumer who
      // never touches any of these models still has this seed check run
      // (since `isInitialized` is false whenever `initDataManager()` was never
      // called), and every model's built-in default would otherwise always be
      // pushed over whatever state already exists --- including a
      // `SkyDataManagerState` that a consumer/test set up some other way
      // without going through `initDataManager()`.
      this.#pushStateField('searchText', defaultOptions.searchText, false);
      this.#pushStateField(
        'activeSortOption',
        defaultOptions.activeSortOption,
        false,
      );
      this.#pushStateField('filterData', defaultOptions.filterData, false);
      this.#pushStateField('selectedIds', defaultOptions.selectedIds, false);
      this.#pushStateField('page', defaultOptions.page, false);
      this.#pushStateField('pageSize', defaultOptions.pageSize, false);
    }
  }
}
