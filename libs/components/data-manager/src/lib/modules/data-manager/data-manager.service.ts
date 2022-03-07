import { Injectable, OnDestroy } from '@angular/core';
import { SkyUIConfigService } from '@skyux/core';

import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import {
  distinctUntilChanged,
  filter,
  map,
  take,
  takeUntil,
} from 'rxjs/operators';

import { SkyDataManagerConfig } from './models/data-manager-config';
import { SkyDataManagerInitArgs } from './models/data-manager-init-args';
import { SkyDataManagerState } from './models/data-manager-state';
import { SkyDataManagerStateChange } from './models/data-manager-state-change';
import { SkyDataManagerStateOptions } from './models/data-manager-state-options';
import { SkyDataManagerStateUpdateFilterArgs } from './models/data-manager-state-update-filter-args';
import { SkyDataViewConfig } from './models/data-view-config';
import { SkyDataViewState } from './models/data-view-state';

/**
 * The data manager service provides ways for data views, toolbar items, and more to stay up to date
 * with the active view ID, data manager config, registered views and their configs, and data state.
 * There are methods to get current values, update values, and get subscriptions to the changing values.<br/> <br/>
 * Provide this service at the component level for each instance of a data manager. Do not
 * provide it at the module level or in `app-extras`. This allows multiple data
 * managers to be used and self-contained.
 */
@Injectable()
export class SkyDataManagerService implements OnDestroy {
  public viewkeeperClasses = new BehaviorSubject<{
    [viewId: string]: string[];
  }>({});

  private readonly activeViewId = new ReplaySubject<string>(1);

  private readonly dataManagerConfig =
    new BehaviorSubject<SkyDataManagerConfig>(undefined);

  private readonly views = new BehaviorSubject<SkyDataViewConfig[]>([]);

  private readonly dataStateChange =
    new ReplaySubject<SkyDataManagerStateChange>(1);

  private _ngUnsubscribe = new Subject();
  private initSource = 'dataManagerServiceInit';
  private isInitialized = false;

  constructor(private uiConfigService: SkyUIConfigService) {}

  public ngOnDestroy(): void {
    this.activeViewId.complete();
    this.dataManagerConfig.complete();
    this.views.complete();
    this.dataStateChange.complete();
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  /**
   * Initializes the data manager with the given settings and sets `isInitialized` to `true`.
   * This must be called for the data manager to render.
   * @param args The initial active view ID, data manager config, and state to use for the data manager.
   * If a settings key is provided, it checks for a saved data state in the SKY UI config service before using the default data state
   * and saves any state changes to the service.
   */
  public initDataManager(args: SkyDataManagerInitArgs): void {
    if (this.isInitialized) {
      console.warn('This data manager instance has already been initialized.');
      return;
    }

    const defaultDataState = args.defaultDataState;
    const settingsKey = args.settingsKey;

    this.updateActiveViewId(args.activeViewId);
    this.updateDataManagerConfig(args.dataManagerConfig);

    if (settingsKey) {
      this.uiConfigService
        .getConfig(settingsKey, defaultDataState.getStateOptions())
        .pipe(take(1))
        .subscribe((config: SkyDataManagerStateOptions) => {
          this.updateDataState(
            new SkyDataManagerState(config),
            this.initSource
          );
        });
    } else {
      this.updateDataState(defaultDataState, this.initSource);
    }

    if (settingsKey) {
      this.getDataStateUpdates(this.initSource)
        .pipe(takeUntil(this._ngUnsubscribe))
        .subscribe((state: SkyDataManagerState) => {
          this.uiConfigService
            .setConfig(settingsKey, state.getStateOptions())
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe(
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              () => {},
              (err) => {
                console.warn('Could not save data manager settings.');
                console.warn(err);
              }
            );
        });
    }
  }

  /**
   * Initializes a view within the data manager. This must be called for each view for the views to appear within the data manager.
   * @param viewConfig The SkyDataViewConfig settings for the view being registered.
   */
  public initDataView(viewConfig: SkyDataViewConfig): void {
    const currentViews: SkyDataViewConfig[] = this.views.value;

    if (this.getViewById(viewConfig.id)) {
      console.warn(
        `A data manager view with the id ${viewConfig.id} has already been initialized.`
      );
      return;
    }

    currentViews.push(viewConfig);
    this.views.next(currentViews);

    // When the initial activeViewId is set there are no views registered. We have to re-emit
    // the activeId so the newly registered view is notified that it is active.
    this.activeViewId.pipe(take(1)).subscribe((id) => {
      this.activeViewId.next(id);
    });

    this.dataStateChange
      .pipe(take(1))
      .subscribe((change) => {
        const dataState = change.dataState;
        const currentViewState = dataState.getViewStateById(viewConfig.id);

        if (!currentViewState) {
          const newViewState = new SkyDataViewState({ viewId: viewConfig.id });

          // Ensure that the view state's available columns match with the view config. Also,
          // add columns to the `displayedColumnIds` as long as they are not `initialHide`
          if (viewConfig.columnOptions) {
            const columnIds = viewConfig.columnOptions.map((columnOptions) => {
              return columnOptions.id;
            });
            const displayedColumnIds = viewConfig.columnOptions
              .filter((columnOption) => {
                return !columnOption.initialHide;
              })
              .map((columnOption) => {
                return columnOption.id;
              });

            newViewState.columnIds = columnIds;
            newViewState.displayedColumnIds = displayedColumnIds;
          }
          const newDataState = dataState.addOrUpdateView(
            viewConfig.id,
            newViewState
          );

          this.updateDataState(newDataState, this.initSource);
        } else {
          const currentAvailableColumnIds = viewConfig.columnOptions?.map(
            (columnOptions) => {
              return columnOptions.id;
            }
          );

          // Ensure that the view state's available columns match with the view config. Also,
          // add new columns to the `displayedColumnIds` as long as they are not `initialHide`.
          // We only add columns to `displayedColumnsIds` if we had previously tracked
          // `columnIds` to avoid breaking changes.
          if (currentViewState.columnIds.length > 0) {
            let newColumnIds = currentAvailableColumnIds.filter(
              (id) => currentViewState.columnIds.indexOf(id) < 0
            );
            newColumnIds = newColumnIds.filter((columnId) => {
              return viewConfig.columnOptions.find(
                (columnOption) =>
                  columnOption.id === columnId && !columnOption.initialHide
              );
            });

            // Add the column IDs that now exist to the data manager state both as available
            // and as shown.
            currentViewState.displayedColumnIds =
              currentViewState.displayedColumnIds.concat(newColumnIds);
          }
          // Add the column IDs that now exist to the data manager state both as available
          // and as shown.
          currentViewState.columnIds = currentAvailableColumnIds;

          const newDataState = dataState.addOrUpdateView(
            viewConfig.id,
            currentViewState
          );

          this.updateDataState(newDataState, this.initSource);
        }
      })
      .unsubscribe();
  }

  /**
   * Returns an observable of data state changes that views and other data manager entities can subscribe to.
   * It excludes updates originating from the provided source. This allows subscribers to only respond to
   * changes they did not create and helps prevent infinite loops of updates and responses.
   * @param sourceId The ID of the entity subscribing to data state updates. This can be any value you choose
   * but should be unique within the data manager instance and should also be used when that entity updates the state.
   */
  public getDataStateUpdates(
    sourceId: string,
    updateFilter?: SkyDataManagerStateUpdateFilterArgs
  ): Observable<SkyDataManagerState> {
    // filter out events from the provided source and emit just the dataState
    if (updateFilter) {
      return this.dataStateChange.pipe(
        filter((stateChange) => sourceId !== stateChange.source),
        map((stateChange) => stateChange.dataState),
        updateFilter.comparator
          ? distinctUntilChanged(updateFilter.comparator)
          : distinctUntilChanged(
              this.getDefaultStateComparator(updateFilter.properties)
            )
      );
    } else {
      return this.dataStateChange.pipe(
        filter((stateChange) => sourceId !== stateChange.source),
        map((stateChange) => stateChange.dataState)
      );
    }
  }

  /**
   * Updates the data state and emits a new value to entities subscribed to data state changes.
   * @param state The new `SkyDataManagerState` value.
   * @param sourceId The ID of the entity updating the state. This can be any value you choose,
   * but should be unique within the data manager instance and should also be used when that entity
   * subscribes to state changes from `getDataStateUpdates`.
   */
  public updateDataState(state: SkyDataManagerState, sourceId: string): void {
    const newState = new SkyDataManagerState(state.getStateOptions());
    const newStateChange = new SkyDataManagerStateChange(newState, sourceId);

    this.dataStateChange.next(newStateChange);
  }

  /**
   * Returns the current `SkyDataManagerConfig`.
   */
  public getCurrentDataManagerConfig(): SkyDataManagerConfig {
    return this.dataManagerConfig.value;
  }

  /**
   * Returns an observable of data manager config changes that views and other data manager entities can subscribe to.
   */
  public getDataManagerConfigUpdates(): Observable<SkyDataManagerConfig> {
    return this.dataManagerConfig;
  }

  /**
   * Updates the data manager config and emits a new value to entities subscribed to data config changes.
   * @param value The new `SkyDataManagerConfig` value.
   */
  public updateDataManagerConfig(value: SkyDataManagerConfig): void {
    this.dataManagerConfig.next(value);
  }

  /**
   * Returns an observable of data view config changes that views and other data manager entities can subscribe to.
   */
  public getDataViewsUpdates(): Observable<SkyDataViewConfig[]> {
    return this.views;
  }

  /**
   * Returns an observable of the active view ID that views and other data manager entities can subscribe to.
   */
  public getActiveViewIdUpdates(): Observable<string> {
    return this.activeViewId;
  }

  /**
   * Updates the active view ID. The data manager changes the displayed view.
   * @param id The new active view ID.
   */
  public updateActiveViewId(id: string): void {
    this.activeViewId.next(id);
  }

  /**
   * Returns the `SkyDataViewConfig` for the given view ID.
   * @param viewId The ID of the view config to get.
   */
  public getViewById(viewId: string): SkyDataViewConfig {
    const currentViews: SkyDataViewConfig[] = this.views.value;
    const viewConfig: SkyDataViewConfig = currentViews.find(
      (view) => view.id === viewId
    );

    return viewConfig;
  }

  /**
   * Updates the given view config. The registered view with the same ID is updated to the
   * provided config, so include all properties regardless of whether they changed. If the
   * view was not initialized already, no update happens.
   * @param view The new `SkyDataViewConfig` containing all properties.
   */
  public updateViewConfig(view: SkyDataViewConfig): void {
    const currentViews: SkyDataViewConfig[] = this.views.value;
    const existingViewIndex = currentViews.findIndex(
      (currentView) => currentView.id === view.id
    );

    if (existingViewIndex === -1) {
      console.error('A view with the id {id} does not exist.', view.id);
    } else {
      currentViews[existingViewIndex] = view;
      this.views.next(currentViews);
    }
  }

  /**
   * @internal
   */
  public setViewkeeperClasses(viewId: string, classes: string[]): void {
    const viewkeeperClasses = this.viewkeeperClasses.value;
    viewkeeperClasses[viewId] = classes;

    this.viewkeeperClasses.next(viewkeeperClasses);
  }

  private filterDataStateProperties(
    state: SkyDataManagerState,
    properties: string[]
  ): SkyDataManagerStateOptions {
    const stateProperties = state.getStateOptions() as { [key: string]: any };
    const filteredStateProperties: any = {};
    for (const property of properties) {
      /* istanbul ignore else */
      if (Object.prototype.hasOwnProperty.call(stateProperties, property)) {
        filteredStateProperties[property] = stateProperties[property];
      }
    }

    return filteredStateProperties;
  }

  private getDefaultStateComparator(
    properties: string[]
  ): (state1: SkyDataManagerState, state2: SkyDataManagerState) => boolean {
    return (
      state1: SkyDataManagerState,
      state2: SkyDataManagerState
    ): boolean => {
      const filteredState1 = this.filterDataStateProperties(state1, properties);
      const filteredState2 = this.filterDataStateProperties(state2, properties);
      return JSON.stringify(filteredState1) === JSON.stringify(filteredState2);
    };
  }
}
