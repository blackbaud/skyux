import {
  Injectable,
  OnDestroy
} from '@angular/core';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  Subject
} from 'rxjs';

import {
  filter,
  map,
  take,
  takeUntil
} from 'rxjs/operators';

import {
  SkyDataManagerConfig
} from './models/data-manager-config';

import {
  SkyDataManagerState
} from './models/data-manager-state';

import {
  SkyDataManagerStateChange
} from './models/data-manager-state-change';

import {
  SkyDataManagerStateOptions
} from './models/data-manager-state-options';

import {
  SkyDataViewConfig
} from './models/data-view-config';

import {
  SkyDataViewState
} from './models/data-view-state';

import {
  SkyDataManagerInitArgs
} from './models/data-manager-init-args';

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

  /**
   * Indicates if the data manager was initialized with configs and state.
   */
  public isInitialized = false;

  private readonly activeViewId: ReplaySubject<string> = new ReplaySubject<string>();

  private readonly dataManagerConfig = new BehaviorSubject<SkyDataManagerConfig>(undefined);

  private readonly views = new BehaviorSubject<SkyDataViewConfig[]>([]);

  private readonly dataStateChange =
    new BehaviorSubject<SkyDataManagerStateChange>(new SkyDataManagerStateChange(new SkyDataManagerState({}), 'defaultState'));

  private _ngUnsubscribe = new Subject();
  private _initSource = 'dataManagerServiceInit';

  constructor(
    private uiConfigService: SkyUIConfigService
  ) { }

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
    const defaultDataState = args.defaultDataState;
    const settingsKey = args.settingsKey;

    this.updateActiveViewId(args.activeViewId);
    this.updateDataManagerConfig(args.dataManagerConfig);

    if (settingsKey) {
      this.uiConfigService.getConfig(settingsKey, defaultDataState.getStateOptions())
        .pipe(take(1))
        .subscribe((config: SkyDataManagerStateOptions) => {
          this.updateDataState(new SkyDataManagerState(config), this._initSource);
        });
    } else {
      this.updateDataState(defaultDataState, this._initSource);
    }

    if (settingsKey) {
      this.getDataStateUpdates(this._initSource)
        .pipe(takeUntil(this._ngUnsubscribe))
        .subscribe((state: SkyDataManagerState) => {
          this.uiConfigService.setConfig(
            settingsKey,
            state.getStateOptions()
          )
            .pipe(takeUntil(this._ngUnsubscribe))
            .subscribe(
              () => { },
              (err) => {
                console.warn('Could not save data manager settings.');
                console.warn(err);
              }
            );
        });
    }

    this.isInitialized = true;
  }

  /**
   * Initializes a view within the data manager. This must be called for each view for the views to appear within the data manager.
   * @param viewConfig The SkyDataViewConfig settings for the view being registered.
   */
  public initDataView(viewConfig: SkyDataViewConfig): void {
    let currentViews: SkyDataViewConfig[] = this.views.value;

    currentViews.push(viewConfig);
    this.views.next(currentViews);

    // When the initial activeViewId is set there are no views registered. We have to re-emit
    // the activeId so the newly registered view is notified that it is active.
    this.activeViewId.pipe(take(1)).subscribe(id => {
      this.activeViewId.next(id);
    });

    const dataState = this.getCurrentDataState();
    const currentViewState = dataState.getViewStateById(viewConfig.id);

    /* istanbul ignore else */
    if (!currentViewState) {
      const newViewState = new SkyDataViewState({ viewId: viewConfig.id });
      const newDataState = dataState.addOrUpdateView(viewConfig.id, newViewState);

      this.updateDataState(newDataState, this._initSource);
    }
  }

  /**
   * Returns the current SkyDataManagerState.
   */
  public getCurrentDataState(): SkyDataManagerState {
    return this.dataStateChange.value && this.dataStateChange.value.dataState;
  }

  /**
   * Returns an observable of data state changes that views and other data manager entities can subscribe to.
   * It excludes updates originating from the provided source. This allows subscribers to only respond to
   * changes they did not create and helps prevent infinite loops of updates and responses.
   * @param sourceId The ID of the entity subscribing to data state updates. This can be any value you choose
   * but should be unique within the data manager instance and should also be used when that entity updates the state.
   */
  public getDataStateUpdates(sourceId: string): Observable<SkyDataManagerState> {
    // filter out events from the provided source and emit just the dataState
    const dataStateObservable = this.dataStateChange.pipe(
      filter(stateChange => sourceId !== stateChange.source),
      map(stateChange => stateChange.dataState)
    );
    return dataStateObservable;
  }

  /**
   * Updates the data state and emits a new value to entities subscribed to data state changes.
   * @param state The new `SkyDataManagerState` value.
   * @param sourceId The ID of the entity updating the state. This can be any value you choose,
   * but should be unique within the data manager instance and should also be used when that entity
   * subscribes to state changes from `getDataStateUpdates`.
   */
  public updateDataState(state: SkyDataManagerState, sourceId: string): void {
    const dataState = this.dataStateChange as BehaviorSubject<SkyDataManagerStateChange>;
    const dataStateChange = new SkyDataManagerStateChange(state, sourceId);

    dataState.next(dataStateChange);
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
    const viewConfig: SkyDataViewConfig = currentViews.find(view => view.id === viewId);

    return viewConfig;
  }

  /**
   * Updates the given view config. The registered view with the same ID is updated to the
   * provided config, so include all properties regardless of whether they changed. If the
   * view was not initialized already, no update happens.
   * @param view The new `SkyDataViewConfig` containing all properties.
   */
  public updateViewConfig(view: SkyDataViewConfig): void {
    let currentViews: SkyDataViewConfig[] = this.views.value;
    const existingViewIndex = currentViews.findIndex(currentView => currentView.id === view.id);

    if (existingViewIndex === -1) {
      console.error('A view with the id {id} already exists.', view.id);
    } else {

    currentViews[existingViewIndex] = view;
    this.views.next(currentViews);
    }
  }
}
