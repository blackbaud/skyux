import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  SkyUIConfigService
} from '@skyux/core';

import {
  Observable,
  Subject
} from 'rxjs';

import {
  DataManagerFixtureComponent
} from './fixtures/data-manager.component.fixture';

import {
  DataManagerFixtureModule
} from './fixtures/data-manager.module.fixture';

import {
  DataViewCardFixtureComponent
} from './fixtures/data-manager-card-view.component.fixture';

import {
  DataViewRepeaterFixtureComponent
} from './fixtures/data-manager-repeater-view.component.fixture';

import {
  SkyDataManagerConfig,
  SkyDataManagerInitArgs,
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState
} from '../../public_api';

describe('SkyDataManagerService', () => {
  let dataManagerFixture: ComponentFixture<DataManagerFixtureComponent>;
  let dataManagerComponent: DataManagerFixtureComponent;
  let dataManagerService: SkyDataManagerService;
  let initialDataState: SkyDataManagerState;
  let uiConfigService: SkyUIConfigService;

  const sourceId = 'unitTests';

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataManagerFixtureComponent,
        DataViewCardFixtureComponent,
        DataViewRepeaterFixtureComponent
      ],
      imports: [
        DataManagerFixtureModule,
        SkyDataManagerModule
      ]
    });

    dataManagerFixture = TestBed.createComponent(DataManagerFixtureComponent);
    dataManagerComponent = dataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    uiConfigService = TestBed.inject(SkyUIConfigService);

    dataManagerFixture.detectChanges();
    initialDataState = dataManagerComponent.dataState;
  });

  describe('initDataManager', () => {
    let dataConfig: SkyDataManagerConfig;
    let activeViewId: string;
    let initArgs: SkyDataManagerInitArgs;

    beforeEach(() => {
      dataConfig = { additionalOptions: { data: 'test' } };
      activeViewId = 'testViewId';

      initArgs = {
        activeViewId,
        dataManagerConfig: dataConfig,
        defaultDataState: initialDataState
      };
    });

    it('should set the data manager activeViewId, config, and state', () => {
      spyOn(dataManagerService, 'updateActiveViewId');
      spyOn(dataManagerService, 'updateDataManagerConfig');
      spyOn(dataManagerService, 'updateDataState');

      dataManagerService.initDataManager(initArgs);

      expect(dataManagerService.updateActiveViewId).toHaveBeenCalledWith(activeViewId);
      expect(dataManagerService.updateDataManagerConfig).toHaveBeenCalledWith(dataConfig);
      expect(dataManagerService.updateDataState).toHaveBeenCalledWith(initialDataState, 'dataManagerServiceInit');
    });

    it('should not set the data manager activeViewId, config, or state when it has already been initialized', () => {
      dataManagerService['isInitialized'] = true;
      spyOn(dataManagerService, 'updateActiveViewId');
      spyOn(dataManagerService, 'updateDataManagerConfig');
      spyOn(dataManagerService, 'updateDataState');

      dataManagerService.initDataManager(initArgs);

      expect(dataManagerService.updateActiveViewId).not.toHaveBeenCalled();
      expect(dataManagerService.updateDataManagerConfig).not.toHaveBeenCalled();
      expect(dataManagerService.updateDataState).not.toHaveBeenCalled();

    });

    describe('with settings key provided', () => {
      const key = 'key';
      let uiConfigServiceGetObservable: Subject<any>;
      let uiConfigServiceSetObservable: Subject<any>;

      beforeEach(() => {
        initArgs.settingsKey = key;
        uiConfigServiceGetObservable = new Subject<any>();
        uiConfigServiceSetObservable = new Subject<any>();
      });

      it('should request a data state from the ui config service', async(() => {
        spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);

        dataManagerService.initDataManager(initArgs);

        dataManagerFixture.whenStable().then(() => {
          expect(uiConfigService.getConfig).toHaveBeenCalledWith(key, initialDataState.getStateOptions());
        });
      }));

      it('should update the data state via the data manager service when the ui config service returns a data state', async(() => {
        spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);
        spyOn(dataManagerService, 'updateDataState');

        dataManagerService.initDataManager(initArgs);

        dataManagerFixture.whenStable().then(() => {
          uiConfigServiceGetObservable.next(initialDataState.getStateOptions());
          expect(uiConfigService.getConfig).toHaveBeenCalledWith(key, initialDataState.getStateOptions());
          expect(dataManagerService.updateDataState).toHaveBeenCalledWith(initialDataState, 'dataManagerServiceInit');
        });
      }));

      it('should update the ui config service when the data state changes', async(() => {
        const newDataState = new SkyDataManagerState({ searchText: 'test' });
        spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);

        dataManagerService.initDataManager(initArgs);

        dataManagerFixture.whenStable().then(() => {
          spyOn(uiConfigService, 'setConfig').and.returnValue(uiConfigServiceSetObservable);
          dataManagerService.updateDataState(newDataState, sourceId);

          uiConfigServiceSetObservable.next('');
          expect(uiConfigService.setConfig).toHaveBeenCalled();
        });
      }));

      it('should log an error when unable to update the ui config service when the data state changes', async(() => {
        const newDataState = new SkyDataManagerState({ searchText: 'test' });
        const errorMessage = 'something went wrong';
        spyOn(uiConfigService, 'getConfig').and.returnValue(uiConfigServiceGetObservable);

        dataManagerService.initDataManager(initArgs);

        dataManagerFixture.whenStable().then(() => {
          spyOn(uiConfigService, 'setConfig').and.returnValue(uiConfigServiceSetObservable);
          spyOn(console, 'warn');
          dataManagerService.updateDataState(newDataState, sourceId);

          uiConfigServiceSetObservable.error(errorMessage);
          expect(uiConfigService.setConfig).toHaveBeenCalled();
          expect(console.warn).toHaveBeenCalledWith(errorMessage);
        });
      }));
    });
  });

  describe('dataState', () => {
    const dataStateUpdate = new SkyDataManagerState({
      searchText: 'testChange'
    });
    let currentDataState: SkyDataManagerState;

    beforeEach(() => {
      dataManagerService.getDataStateUpdates(sourceId).subscribe(state => currentDataState = state);
    });

    it('should update the data state of all subscribed components', () => {
      expect(currentDataState).toEqual(initialDataState);

      dataManagerService.updateDataState(dataStateUpdate, 'test');

      expect(currentDataState).toEqual(dataStateUpdate);
      expect(dataManagerComponent.dataState).toEqual(dataStateUpdate);
    });

    describe('getDataStateUpdates observable', () => {
      let dataState: SkyDataManagerState;
      let dataStateObservable: Observable<SkyDataManagerState>;

      beforeEach(() => {
        dataStateObservable = dataManagerService.getDataStateUpdates(sourceId);
        dataState = currentDataState;

        dataStateObservable.subscribe(state => {
          dataState = state;
        });
      });

      it('should emit new values when the sourceId of the change is different from the given sourceId', () => {
        const startingDataState = dataState;

        expect(dataState).toEqual(startingDataState);

        dataManagerService.updateDataState(dataStateUpdate, 'differentId');

        expect(dataState).not.toEqual(startingDataState);
        expect(dataState).toEqual(dataStateUpdate);
      });

      it('should not emit new values when the sourceId of the change matches the given sourceId', () => {
        const startingDataState = dataState;

        expect(dataState).toEqual(startingDataState);

        dataManagerService.updateDataState(dataStateUpdate, sourceId);

        expect(dataState).toEqual(startingDataState);
      });
    });
  });

  describe('dataManagerConfig', () => {
    const dataConfigUpdate = {
      additionalOptions: {
        test: 'data'
      }
    };

    it('getCurrentDataManagerConfig should return the current config of the data manager', () => {
      expect(dataManagerService.getCurrentDataManagerConfig()).toEqual(dataManagerComponent.dataManagerConfig);
    });

    it('updateDataManagerConfig should update the config of all subscribed components', () => {
      dataManagerService.updateDataManagerConfig(dataConfigUpdate);

      expect(dataManagerService.getCurrentDataManagerConfig()).toEqual(dataConfigUpdate);
    });

    it('getDataManagerConfigUpdates observable should emit new config values', () => {
      const initialDataConfig = dataManagerService.getCurrentDataManagerConfig();
      const dataConfigObservable = dataManagerService.getDataManagerConfigUpdates();
      let dataConfig = initialDataConfig;

      dataConfigObservable.subscribe(config => {
        dataConfig = config;
      });

      expect(dataConfig).toEqual(initialDataConfig);

      dataManagerService.updateDataManagerConfig(dataConfigUpdate);

      expect(dataConfig).not.toEqual(initialDataConfig);
      expect(dataConfig).toEqual(dataConfigUpdate);
    });
  });

  describe('activeViewId', () => {
    const newActiveViewId = 'cardsView';

    it('updateActiveViewId should update the active view id and emit it to all subscribed components', () => {

      expect(dataManagerComponent.activeViewId).not.toEqual(newActiveViewId);

      dataManagerService.updateActiveViewId(newActiveViewId);

      expect(dataManagerComponent.activeViewId).toEqual(newActiveViewId);
    });

    it('getActiveViewIdUpdates observable should emit new id values', () => {
      const initialActiveViewId = dataManagerComponent.activeViewId;
      const activeViewIdObservable = dataManagerService.getActiveViewIdUpdates();
      let activeViewId = initialActiveViewId;

      activeViewIdObservable.subscribe(id => {
        activeViewId = id;
      });

      expect(activeViewId).toEqual(initialActiveViewId);

      dataManagerService.updateActiveViewId(newActiveViewId);

      expect(activeViewId).not.toEqual(initialActiveViewId);
      expect(activeViewId).toEqual(newActiveViewId);
    });
  });

  describe('initDataView', () => {
    it('should create a new view config and view state when a data state has been set', async(() => {
      let currentDataState: SkyDataManagerState;

      dataManagerService.getDataStateUpdates(sourceId).subscribe(state => currentDataState = state);
      dataManagerService.updateDataState(new SkyDataManagerState({}), 'test');

      dataManagerFixture.detectChanges();

      dataManagerFixture.whenStable().then(() => {
        const newView = { id: 'newView', name: 'newView' };
        let viewState = currentDataState.getViewStateById(newView.id);

        expect(dataManagerService.getViewById(newView.id)).toBeUndefined();
        expect(viewState).toBeUndefined();

        dataManagerService.initDataView(newView);
        viewState = currentDataState.getViewStateById(newView.id);

        expect(dataManagerService.getViewById(newView.id)).toEqual(newView);
        expect(viewState).toBeDefined();
      });
    }));

    it('should not create a new view and update the data state if a view with that ID is already defined', () => {
      const view = { id: 'view', name: 'View' };
      spyOn(dataManagerService, 'getViewById').and.returnValue(view);
      spyOn(dataManagerService, 'updateDataState');
      spyOn(console, 'warn');

      dataManagerService.initDataView(view);

      expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(`A data manager view with the id ${view.id} has already been initialized.`);
    });
  });

  describe('views', () => {
    it('getViewById should return the SkyDataViewConfig with the given id', async(() => {
      dataManagerFixture.whenStable().then(() => {
        const repeaterViewConfig = dataManagerComponent.repeaterView.viewConfig;

        expect(dataManagerService.getViewById(repeaterViewConfig.id)).toEqual(repeaterViewConfig);
      });
    }));

    describe('updateViewConfig', () => {
      it('returns undefined when trying to update a view that it is not registered', async(() => {
        dataManagerFixture.whenStable().then(() => {
          const newView = { id: 'newView', name: 'newView' };

          expect(dataManagerService.getViewById(newView.id)).toBeUndefined();

          dataManagerService.updateViewConfig(newView);

          expect(dataManagerService.getViewById(newView.id)).toBeUndefined();
        });
      }));

      it('updates a view config when it is already registered', async(() => {
        dataManagerFixture.whenStable().then(() => {
          const repeaterViewConfig = dataManagerComponent.repeaterView.viewConfig;
          const modifiedConfig = {
            id: repeaterViewConfig.id,
            name: 'new name'
          };

          let registeredConfig = dataManagerService.getViewById(repeaterViewConfig.id);

          expect(registeredConfig).toEqual(repeaterViewConfig);
          expect(registeredConfig).not.toEqual(modifiedConfig);

          dataManagerService.updateViewConfig(modifiedConfig);
          registeredConfig = dataManagerService.getViewById(repeaterViewConfig.id);

          expect(registeredConfig).not.toEqual(repeaterViewConfig);
          expect(registeredConfig).toEqual(modifiedConfig);
        });
      }));
    });
  });

  it('should set the viewkeeper classes for the given viewId when setViewkeeperClasses is called', () => {
    const newClass = 'newClass';
    const viewId = 'testId';
    let viewkeeperClasses: {[viewId: string]: string[]};

    dataManagerService.viewkeeperClasses.subscribe(classes => viewkeeperClasses = classes);

    dataManagerService.setViewkeeperClasses(viewId, [newClass]);

    expect(viewkeeperClasses[viewId]).toBeDefined();
    expect(viewkeeperClasses[viewId].indexOf(newClass) >= 0).toBeTrue();
  });
});
