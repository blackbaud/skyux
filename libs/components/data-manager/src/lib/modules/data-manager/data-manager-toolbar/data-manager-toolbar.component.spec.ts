import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyContentInfoProvider,
  SkyLogService,
  SkyUIConfigService,
} from '@skyux/core';
import { SkyFilterState, SkyFilterStateService } from '@skyux/lists';
import { SkySortHarness } from '@skyux/lists/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject, throwError } from 'rxjs';

import { SkyDataManagerColumnPickerContext } from '../data-manager-column-picker/data-manager-column-picker-context';
import { SKY_DATA_MANAGER_COLUMN_PICKER_PROVIDERS } from '../data-manager-column-picker/data-manager-column-picker-providers';
import { SkyDataManagerColumnPickerComponent } from '../data-manager-column-picker/data-manager-column-picker.component';
import { SkyDataManagerColumnPickerService } from '../data-manager-column-picker/data-manager-column-picker.service';
import { SkyDataManagerFilterControllerDirective } from '../data-manager-filters/data-manager-filter-controller.directive';
import { SkyDataManagerService } from '../data-manager.service';
import { DataManagerFixtureComponent } from '../fixtures/data-manager.component.fixture';
import { DataManagerFixtureModule } from '../fixtures/data-manager.module.fixture';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';
import { SkyDataManagerColumnPickerSortStrategy } from '../models/data-manager-column-picker-sort-strategy';
import { SkyDataManagerSortOption } from '../models/data-manager-sort-option';
import { SkyDataManagerState } from '../models/data-manager-state';
import { SkyDataViewConfig } from '../models/data-view-config';
import { SkyDataViewState } from '../models/data-view-state';

import { SkyDataManagerSortOptionComponent } from './data-manager-sort-option.component';
import { SkyDataManagerToolbarPrimaryItemComponent } from './data-manager-toolbar-primary-item.component';
import { SkyDataManagerToolbarComponent } from './data-manager-toolbar.component';

class MockModalService {
  public closeCallback:
    | ((args: { reason: string; data?: unknown }) => void)
    | undefined;

  public open(): {
    closed: {
      subscribe: (
        callback: (args: { reason: string; data?: unknown }) => void,
      ) => void;
    };
  } {
    return {
      closed: {
        subscribe: (
          callback: (args: { reason: string; data?: unknown }) => void,
        ): void => {
          this.closeCallback = callback;
        },
      },
    };
  }
}

@Component({
  template: '',
})
class MockModalComponent {}

@Component({
  template: '',
  standalone: false,
})
class MockModalLegacyComponent {}

@Component({
  imports: [
    SkyDataManagerToolbarComponent,
    SkyDataManagerToolbarPrimaryItemComponent,
  ],
  template: `
    <sky-data-manager-toolbar>
      <sky-data-manager-toolbar-primary-item>
        <button type="button">Primary</button>
      </sky-data-manager-toolbar-primary-item>
    </sky-data-manager-toolbar>
  `,
})
class ProjectedContentHostComponent {}

describe('SkyDataManagerToolbarComponent', () => {
  let dataManagerToolbarFixture: ComponentFixture<SkyDataManagerToolbarComponent>;
  let dataManagerToolbarComponent: SkyDataManagerToolbarComponent;
  let dataManagerToolbarNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;
  let modalServiceInstance: MockModalService;
  let viewConfig: SkyDataViewConfig;

  function getClearAllButton(): HTMLButtonElement | undefined {
    return dataManagerToolbarFixture.debugElement.query(
      By.css('.sky-data-manager-clear-all-btn'),
    ).nativeElement;
  }

  function getColumnPickerButton(): HTMLButtonElement | undefined {
    return dataManagerToolbarFixture.debugElement.query(
      By.css('.sky-col-picker-btn'),
    ).nativeElement;
  }

  function getSelectAllButton(): HTMLButtonElement | undefined {
    return dataManagerToolbarFixture.debugElement.query(
      By.css('.sky-data-manager-select-all-btn'),
    ).nativeElement;
  }

  function getSectionFilterCheckbox(): HTMLInputElement | undefined {
    return dataManagerToolbarFixture.debugElement.query(
      By.css(
        '.sky-data-manager-multiselect-toolbar sky-toolbar-view-actions input',
      ),
    ).nativeElement;
  }

  function setSearchInput(text: string): void {
    const inputEl = dataManagerToolbarFixture.debugElement.query(
      By.css('input'),
    );
    inputEl.nativeElement.value = text;

    SkyAppTestUtility.fireDomEvent(inputEl.nativeElement, 'input', {
      bubbles: false,
      cancelable: false,
    });
    dataManagerToolbarFixture.detectChanges();

    SkyAppTestUtility.fireDomEvent(inputEl.nativeElement, 'change', {
      bubbles: false,
      cancelable: false,
    });
    dataManagerToolbarFixture.detectChanges();
  }

  function triggerSearchInputEnter(): void {
    const inputEl = dataManagerToolbarFixture.debugElement.query(
      By.css('.sky-search-container input'),
    );

    // The `any` cast here is because the typescript types for KeyboardEventInit do not include
    // `which` but our current search component implementation uses it.
    SkyAppTestUtility.fireDomEvent(inputEl.nativeElement, 'keyup', {
      keyboardEventInit: {
        code: 'Enter',
      },
    });
    dataManagerToolbarFixture.detectChanges();
  }

  function triggerSearchApplyButton(): void {
    const applyEl = dataManagerToolbarFixture.debugElement.query(
      By.css('.sky-search-btn-apply'),
    );
    SkyAppTestUtility.fireDomEvent(applyEl.nativeElement, 'click');
    dataManagerToolbarFixture.detectChanges();
  }

  beforeEach(() => {
    modalServiceInstance = new MockModalService();

    TestBed.configureTestingModule({
      declarations: [MockModalLegacyComponent],
      imports: [DataManagerFixtureModule],
      providers: [
        {
          provide: SkyModalService,
          useValue: modalServiceInstance,
        },
      ],
    });

    dataManagerToolbarFixture = TestBed.createComponent(
      SkyDataManagerToolbarComponent,
    );
    dataManagerToolbarNativeElement = dataManagerToolbarFixture.nativeElement;
    dataManagerToolbarComponent = dataManagerToolbarFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    viewConfig = {
      id: 'cardsView',
      name: 'test view',
    };
    dataManagerToolbarComponent.activeView = viewConfig;
    dataManagerToolbarComponent.dataState = new SkyDataManagerState({});
  });

  it('should render custom buttons', () => {
    const dataManagerFixture = TestBed.createComponent(
      DataManagerFixtureComponent,
    );
    const dataManagerNativeElement = dataManagerFixture.nativeElement;
    dataManagerFixture.detectChanges();

    const primaryButton = dataManagerNativeElement.querySelector(
      '.primary-test-button',
    );
    const leftButton =
      dataManagerNativeElement.querySelector('.left-test-button');
    const rightButton =
      dataManagerNativeElement.querySelector('.right-test-button');

    expect(primaryButton).toBeVisible();
    expect(leftButton).toBeVisible();
    expect(rightButton).toBeVisible();
  });

  it('should not render the main toolbar when it has no content', () => {
    dataManagerToolbarFixture.detectChanges();

    const toolbar = dataManagerToolbarNativeElement.querySelector(
      'sky-toolbar:not(.sky-data-manager-multiselect-toolbar)',
    );

    expect(toolbar).toBeNull();
  });

  it('should render the main toolbar when the active view enables a feature', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      sortEnabled: true,
    });
    dataManagerToolbarFixture.detectChanges();

    const toolbar = dataManagerToolbarNativeElement.querySelector(
      'sky-toolbar:not(.sky-data-manager-multiselect-toolbar)',
    );

    expect(toolbar).not.toBeNull();
  });

  it('should render the main toolbar when only projected content is present', () => {
    const hostFixture = TestBed.createComponent(ProjectedContentHostComponent);
    hostFixture.detectChanges();

    const toolbar = hostFixture.nativeElement.querySelector(
      'sky-toolbar:not(.sky-data-manager-multiselect-toolbar)',
    );

    expect(toolbar).not.toBeNull();
  });

  it('should show a sort button if the data view config has sort enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      sortEnabled: true,
    });
    dataManagerToolbarFixture.detectChanges();

    const sortDropdownBtn =
      dataManagerToolbarNativeElement.querySelector('sky-sort button');

    expect(sortDropdownBtn).toBeVisible();
  });

  it('should not show a sort button if the data view config does not have sort enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      sortEnabled: false,
    });
    dataManagerToolbarFixture.detectChanges();

    const sortDropdown =
      dataManagerToolbarNativeElement.querySelector('sky-sort');

    expect(sortDropdown).toBeNull();
  });

  it('should show a column picker button if the data view config has column picker enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      columnPickerEnabled: true,
    });
    dataManagerToolbarFixture.detectChanges();

    const colPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn',
    );

    expect(colPickerBtn).toBeVisible();
  });

  it('should not show a column picker button if the data view config does not have column picker enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      columnPickerEnabled: false,
    });
    dataManagerToolbarFixture.detectChanges();

    const colPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn',
    );

    expect(colPickerBtn).toBeNull();
  });

  it('should show a filter button if the data view config has filters enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: true,
    });
    dataManagerToolbarFixture.detectChanges();

    const filterBtn =
      dataManagerToolbarNativeElement.querySelector('sky-filter-button');

    expect(filterBtn).toBeVisible();
  });

  it('should not show a filter button if the data view config does not have filters enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: false,
    });
    dataManagerToolbarFixture.detectChanges();

    const filterBtn =
      dataManagerToolbarNativeElement.querySelector('sky-filter-button');

    expect(filterBtn).toBeNull();
  });

  it('should show a search box if the data view config has search enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      searchEnabled: true,
    });
    dataManagerToolbarFixture.detectChanges();

    const search = dataManagerToolbarNativeElement.querySelector('sky-search');

    expect(search).toBeVisible();
  });

  it('should not show a search box if the data view config does not have search enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      searchEnabled: false,
    });
    dataManagerToolbarFixture.detectChanges();

    const search = dataManagerToolbarNativeElement.querySelector('sky-search');

    expect(search).toBeNull();
  });

  it('should show a multiselect toolbar if the data view config has multiselect enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      multiselectToolbarEnabled: true,
    });
    dataManagerToolbarFixture.detectChanges();

    const multiselectToolbar = dataManagerToolbarNativeElement.querySelector(
      '.sky-data-manager-multiselect-toolbar',
    );

    expect(multiselectToolbar).toBeVisible();
  });

  it('should not show a multiselect toolbar if the data view config does not have multiselect enabled', () => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      multiselectToolbarEnabled: false,
    });
    dataManagerToolbarFixture.detectChanges();

    const multiselectToolbar = dataManagerToolbarNativeElement.querySelector(
      '.sky-data-manager-multiselect-toolbar',
    );

    expect(multiselectToolbar).toBeNull();
  });

  it("should call the active view's onSelectAllClick function when select all is clicked", () => {
    const selectAllSpy = jasmine.createSpy();

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      multiselectToolbarEnabled: true,
      onSelectAllClick: selectAllSpy,
    });
    dataManagerToolbarFixture.detectChanges();

    const selectAllBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-data-manager-select-all-btn',
    ) as HTMLButtonElement;
    selectAllBtn.click();

    expect(selectAllSpy).toHaveBeenCalled();
  });

  it("should call the active view's onClearAllClick function when clear all is clicked", () => {
    const clearAllSpy = jasmine.createSpy();

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      multiselectToolbarEnabled: true,
      onClearAllClick: clearAllSpy,
    });
    dataManagerToolbarFixture.detectChanges();

    const clearAllBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-data-manager-clear-all-btn',
    ) as HTMLButtonElement;
    clearAllBtn.click();

    expect(clearAllSpy).toHaveBeenCalled();
  });

  it('should update the data state when the only show selected checkbox state changes', () => {
    dataManagerToolbarFixture.detectChanges();

    const updatedDataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;
    updatedDataState.onlyShowSelected = true;
    spyOn(dataManagerService, 'updateDataState');

    dataManagerToolbarComponent.onOnlyShowSelected({ checked: true });

    expect(
      (dataManagerToolbarComponent.dataState as SkyDataManagerState)
        .onlyShowSelected,
    ).toBeTrue();
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      updatedDataState,
      'toolbar',
    );
  });

  it('should retrieve the active view when the data manager service emits a new active view id', () => {
    const activeViewIdObservable = new Subject<string>();
    const nextId = 'test';
    spyOn(dataManagerService, 'getActiveViewIdUpdates').and.returnValue(
      activeViewIdObservable,
    );
    spyOn(dataManagerService, 'getViewById');

    dataManagerToolbarFixture.detectChanges();

    activeViewIdObservable.next(nextId);

    expect(dataManagerService.getViewById).toHaveBeenCalledWith(nextId);
  });

  it('should update the data state when a sort option is selected', () => {
    spyOn(dataManagerService, 'updateDataState');
    const sortOption = {
      id: '1',
      descending: true,
      label: 'Name Z-A',
      propertyName: 'name',
    };

    dataManagerToolbarFixture.detectChanges();

    const dataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;
    dataState.activeSortOption = sortOption;
    dataManagerToolbarComponent.sortSelected(sortOption);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar',
    );
  });

  it('should update the data state when text is searched', () => {
    spyOn(dataManagerService, 'updateDataState');
    const searchText = 'testing';

    dataManagerToolbarFixture.detectChanges();

    const dataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;
    dataState.searchText = searchText;
    dataManagerToolbarComponent.searchApplied(searchText);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar',
    );
  });

  it('should not update the data state when search text is typed but not applied', fakeAsync(() => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      searchEnabled: true,
    });
    spyOn(dataManagerService, 'updateDataState');

    dataManagerToolbarFixture.detectChanges();

    const dataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;
    expect(dataState.searchText).toBeUndefined();

    setSearchInput('testing');

    dataManagerToolbarFixture.detectChanges();
    tick();
    dataManagerToolbarFixture.detectChanges();

    expect(dataState.searchText).toBeUndefined();
    expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
  }));

  it('should update the data state when search text is typed and applied via enter', fakeAsync(() => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      searchEnabled: true,
    });
    spyOn(dataManagerService, 'updateDataState');

    dataManagerToolbarFixture.detectChanges();

    const dataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;
    expect(dataState.searchText).toBeUndefined();

    setSearchInput('testing');
    triggerSearchInputEnter();

    dataManagerToolbarFixture.detectChanges();
    tick();
    dataManagerToolbarFixture.detectChanges();

    expect(dataState.searchText).toBe('testing');
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar',
    );
  }));

  it('should update the data state when search text is typed and applied via the search button', fakeAsync(() => {
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      searchEnabled: true,
    });
    spyOn(dataManagerService, 'updateDataState');

    dataManagerToolbarFixture.detectChanges();

    const dataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;
    expect(dataState.searchText).toBeUndefined();

    setSearchInput('testing');
    triggerSearchApplyButton();

    dataManagerToolbarFixture.detectChanges();
    tick();
    dataManagerToolbarFixture.detectChanges();

    expect(dataState.searchText).toBe('testing');
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar',
    );
  }));

  it('should update the active view id via the data manager service when the view changes', () => {
    const newViewId = 'testId';
    spyOn(dataManagerService, 'updateActiveViewId');

    dataManagerToolbarComponent.onViewChange(newViewId);

    expect(dataManagerService.updateActiveViewId).toHaveBeenCalledWith(
      newViewId,
    );
  });

  it('should update the active view config when any view is updated', () => {
    const myViewState = new SkyDataViewState({
      viewId: 'cardsView',
    });
    const myDefaultDataState = new SkyDataManagerState({
      views: [myViewState],
    });

    dataManagerService.initDataManager({
      activeViewId: 'cardsView',
      dataManagerConfig: {},
      defaultDataState: myDefaultDataState,
    });

    const myViewConfig = {
      id: 'cardsView',
      name: 'test view',
      filterButtonEnabled: false,
    };
    dataManagerService.initDataView(myViewConfig);

    dataManagerToolbarFixture.detectChanges();

    let filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button',
    ) as HTMLButtonElement;

    expect(filterBtn).toBeFalsy();

    dataManagerService.updateViewConfig({
      ...(dataManagerService.getViewById('cardsView') as SkyDataViewConfig),
      filterButtonEnabled: true,
    });

    dataManagerToolbarFixture.detectChanges();

    filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button',
    ) as HTMLButtonElement;

    expect(filterBtn).toExist();
  });

  it('should open the provided filter modal when the filter button is clicked', () => {
    spyOn(modalServiceInstance, 'open').and.callThrough();
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: true,
    });

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = {
      filterModalComponent: MockModalComponent,
    };

    const filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button',
    ) as HTMLButtonElement;

    filterBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalled();
  });

  it('should open the provided filter modal when the filter button is clicked, using legacy modal service', () => {
    const logger = TestBed.inject(SkyLogService);
    spyOn(logger, 'deprecated').and.returnValue(void Promise.resolve());
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: true,
    });

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = {
      filterModalComponent: MockModalLegacyComponent,
    };

    const filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button',
    ) as HTMLButtonElement;

    filterBtn.click();

    expect(logger.deprecated).toHaveBeenCalled();
  });

  it('should save the returned filter data when the provided filter modal is saved', () => {
    const mockModal = new MockModalComponent();
    const filterData = { filtersApplied: false, filters: { test: 'test' } };
    spyOn(dataManagerService, 'updateDataState');

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: true,
    });

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = {
      filterModalComponent: mockModal,
    };
    const filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button',
    ) as HTMLButtonElement;
    const dataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;

    filterBtn.click();

    if (modalServiceInstance.closeCallback) {
      modalServiceInstance.closeCallback({
        reason: 'save',
        data: filterData,
      });
    }

    expect(dataManagerToolbarComponent.dataState?.filterData).toEqual(
      filterData,
    );
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar',
    );
  });

  it('should not save the returned filter data when the provided filter modal is canceled', () => {
    const mockModal = new MockModalComponent();
    spyOn(dataManagerService, 'updateDataState');

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: true,
    });
    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = {
      filterModalComponent: mockModal,
    };

    const filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button',
    ) as HTMLButtonElement;

    filterBtn.click();

    if (modalServiceInstance.closeCallback) {
      modalServiceInstance.closeCallback({
        reason: 'cancel',
      });
    }

    expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
  });

  it('should not open a modal when the filter button is clicked if none is provided', () => {
    spyOn(modalServiceInstance, 'open');

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: true,
    });

    dataManagerToolbarFixture.detectChanges();

    const filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button',
    ) as HTMLButtonElement;
    filterBtn.click();

    expect(modalServiceInstance.open).not.toHaveBeenCalled();
  });

  it('should open the column picker modal when the column picker button is clicked', () => {
    spyOn(modalServiceInstance, 'open').and.callThrough();

    const columnOptions: SkyDataManagerColumnPickerOption[] = [];
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      columnOptions: columnOptions,
      columnPickerEnabled: true,
    });

    const viewState = new SkyDataViewState({
      viewId: viewConfig.id,
    });

    dataManagerToolbarFixture.detectChanges();

    (dataManagerToolbarComponent.dataState as SkyDataManagerState).views = [
      viewState,
    ];

    const context = new SkyDataManagerColumnPickerContext(
      columnOptions,
      viewState.displayedColumnIds,
    );
    const options: SkyModalConfigurationInterface = {
      providers: [
        SKY_DATA_MANAGER_COLUMN_PICKER_PROVIDERS,
        {
          provide: SkyDataManagerColumnPickerContext,
          useValue: context,
        },
      ],
    };

    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn',
    ) as HTMLButtonElement;

    columnPickerBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalledWith(
      SkyDataManagerColumnPickerComponent,
      options,
    );
  });

  it('should open the column picker modal with columnPickerSortStrategy set in context when the column picker button is clicked and the view has None specified', () => {
    spyOn(modalServiceInstance, 'open').and.callThrough();

    const viewState = new SkyDataViewState({
      viewId: viewConfig.id,
    });
    const columnOptions: SkyDataManagerColumnPickerOption[] = [];

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      columnPickerEnabled: true,
      columnOptions: columnOptions,
      columnPickerSortStrategy: SkyDataManagerColumnPickerSortStrategy.None,
    });

    dataManagerToolbarFixture.detectChanges();

    (dataManagerToolbarComponent.dataState as SkyDataManagerState).views = [
      viewState,
    ];

    const context = new SkyDataManagerColumnPickerContext(
      columnOptions,
      viewState.displayedColumnIds,
      SkyDataManagerColumnPickerSortStrategy.None,
    );
    const options: SkyModalConfigurationInterface = {
      providers: [
        SKY_DATA_MANAGER_COLUMN_PICKER_PROVIDERS,
        {
          provide: SkyDataManagerColumnPickerContext,
          useValue: context,
        },
      ],
    };

    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn',
    ) as HTMLButtonElement;

    columnPickerBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalledWith(
      SkyDataManagerColumnPickerComponent,
      options,
    );
  });

  it('should save the returned column data when the column picker modal is saved', () => {
    const viewState = new SkyDataViewState({
      viewId: viewConfig.id,
    });
    spyOn(dataManagerService, 'updateDataState');

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      columnPickerEnabled: true,
      columnOptions: [],
    });

    dataManagerToolbarFixture.detectChanges();

    (dataManagerToolbarComponent.dataState as SkyDataManagerState).views = [
      viewState,
    ];

    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn',
    ) as HTMLButtonElement;
    const dataState =
      dataManagerToolbarComponent.dataState as SkyDataManagerState;

    columnPickerBtn.click();

    if (modalServiceInstance.closeCallback) {
      modalServiceInstance.closeCallback({
        reason: 'save',
        data: [{ id: '1', label: 'Column 1' }],
      });
    }

    viewState.displayedColumnIds = ['1'];
    dataState.views = [viewState];

    expect(
      dataManagerToolbarComponent.dataState?.getViewStateById(viewConfig.id),
    ).toEqual(viewState);
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar',
    );
  });

  it('should not save the returned column data when the column picker modal is canceled', () => {
    const viewState = new SkyDataViewState({
      viewId: viewConfig.id,
    });
    spyOn(dataManagerService, 'updateDataState');

    (
      dataManagerToolbarComponent.activeView as SkyDataViewConfig
    ).columnPickerEnabled = true;

    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      columnOptions: [],
    });

    dataManagerToolbarFixture.detectChanges();

    (dataManagerToolbarComponent.dataState as SkyDataManagerState).views = [
      viewState,
    ];
    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn',
    ) as HTMLButtonElement;

    columnPickerBtn.click();

    if (modalServiceInstance.closeCallback) {
      modalServiceInstance.closeCallback({
        reason: 'cancel',
      });
    }

    expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
  });

  it('should not open the column picker modal when there are no column options', () => {
    spyOn(modalServiceInstance, 'open');

    (
      dataManagerToolbarComponent.activeView as SkyDataViewConfig
    ).columnPickerEnabled = true;
    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.openColumnPicker();

    expect(modalServiceInstance.open).not.toHaveBeenCalled();
  });

  describe('without a registered view', () => {
    beforeEach(() => {
      dataManagerToolbarComponent.activeView = undefined;
      dataManagerService.setColumnOptions([
        { id: 'name', labelText: 'Name' },
        { id: 'age', labelText: 'Age' },
      ]);
      dataManagerToolbarFixture.detectChanges();
    });

    it('should display the column picker button when columns are registered', () => {
      expect(
        dataManagerToolbarNativeElement.querySelector('.sky-col-picker-btn'),
      ).toBeTruthy();
    });

    it('should open the column picker with the registered columns', () => {
      spyOn(modalServiceInstance, 'open').and.callThrough();

      (
        dataManagerToolbarComponent.dataState as SkyDataManagerState
      ).displayedColumnIds = ['name'];

      const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
        '.sky-col-picker-btn',
      ) as HTMLButtonElement;
      columnPickerBtn.click();

      expect(modalServiceInstance.open).toHaveBeenCalledWith(
        SkyDataManagerColumnPickerComponent,
        {
          providers: [
            SKY_DATA_MANAGER_COLUMN_PICKER_PROVIDERS,
            {
              provide: SkyDataManagerColumnPickerContext,
              useValue: new SkyDataManagerColumnPickerContext(
                [
                  {
                    alwaysDisplayed: undefined,
                    description: undefined,
                    id: 'name',
                    initialHide: undefined,
                    label: 'Name',
                  },
                  {
                    alwaysDisplayed: undefined,
                    description: undefined,
                    id: 'age',
                    initialHide: undefined,
                    label: 'Age',
                  },
                ],
                ['name'],
              ),
            },
          ],
        },
      );
    });

    it('should save the returned columns to the data state', () => {
      const updateSpy = spyOn(dataManagerService, 'updateDataState');

      (
        dataManagerToolbarComponent.dataState as SkyDataManagerState
      ).displayedColumnIds = ['name'];

      const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
        '.sky-col-picker-btn',
      ) as HTMLButtonElement;
      columnPickerBtn.click();

      modalServiceInstance.closeCallback?.({
        reason: 'save',
        data: [{ id: 'name' }, { id: 'age' }],
      });

      expect(updateSpy).toHaveBeenCalled();
      expect(
        (updateSpy.calls.mostRecent().args[0] as SkyDataManagerState)
          .displayedColumnIds,
      ).toEqual(['name', 'age']);
    });
  });

  describe('a11y', () => {
    it('should set accessibility labels correctly when no list descriptor is given', () => {
      const patchInfoSpy = spyOn(
        SkyContentInfoProvider.prototype,
        'patchInfo',
      ).and.stub();

      spyOn(dataManagerService, 'getViewById').and.returnValue({
        ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
        multiselectToolbarEnabled: true,
        columnPickerEnabled: true,
        onSelectAllClick: () => {},
        onClearAllClick: () => {},
      });
      dataManagerToolbarFixture.detectChanges();

      expect(patchInfoSpy.calls.count()).toBe(1);
      expect(patchInfoSpy.calls.all()[0].args).toEqual([
        { descriptor: undefined },
      ]);

      expect(getClearAllButton()?.getAttribute('aria-label')).toBeNull();
      expect(getColumnPickerButton()?.getAttribute('aria-label')).toBe(
        'Columns',
      );
      expect(getSectionFilterCheckbox()?.getAttribute('aria-label')).toBeNull();
      expect(getSelectAllButton()?.getAttribute('aria-label')).toBeNull();
    });

    it('should set accessibility labels correctly when a list descriptor is given', () => {
      const patchInfoSpy = spyOn(
        SkyContentInfoProvider.prototype,
        'patchInfo',
      ).and.stub();

      const dataManagerFixture = TestBed.createComponent(
        DataManagerFixtureComponent,
      );
      dataManagerFixture.componentInstance.activeViewId = 'cardsView';
      dataManagerFixture.componentInstance.dataManagerConfig.listDescriptor =
        'constituents';
      dataManagerFixture.detectChanges();

      expect(patchInfoSpy.calls.count()).toBe(1);
      expect(patchInfoSpy.calls.all()[0].args).toEqual([
        { descriptor: { value: 'constituents', type: 'text' } },
      ]);

      spyOn(dataManagerService, 'getViewById').and.returnValue({
        ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
        multiselectToolbarEnabled: true,
        columnPickerEnabled: true,
        onSelectAllClick: () => {},
        onClearAllClick: () => {},
      });
      dataManagerToolbarFixture.detectChanges();

      expect(getClearAllButton()?.getAttribute('aria-label')).toBe(
        'Clear all selected constituents',
      );
      expect(getColumnPickerButton()?.getAttribute('aria-label')).toBe(
        'Choose columns for constituents',
      );
      expect(getSectionFilterCheckbox()?.getAttribute('aria-label')).toBe(
        'Show only selected constituents',
      );
      expect(getSelectAllButton()?.getAttribute('aria-label')).toBe(
        'Select all constituents',
      );
    });

    it('should pass accessibility', async () => {
      await expectAsync(dataManagerToolbarNativeElement).toBeAccessible();
    });
  });
});

@Component({
  selector: 'sky-test-host',
  template: `
    <sky-data-manager-toolbar
      [searchEnabled]="true"
      [searchPlaceholderText]="'Search fruit'"
      [(searchText)]="searchText"
      [(sort)]="sort"
      [(page)]="page"
      [(selectedIds)]="selectedIds"
      [(totalCount)]="totalCount"
    >
      <sky-data-manager-sort-option
        id="az"
        propertyName="name"
        label="Name (A - Z)"
      />
    </sky-data-manager-toolbar>
  `,
  imports: [SkyDataManagerToolbarComponent, SkyDataManagerSortOptionComponent],
})
class TestHostComponent {
  public searchText = '';
  public sort: SkyDataManagerSortOption | undefined;
  public page = 1;
  public selectedIds: string[] = [];
  public totalCount = 0;
}

describe('SkyDataManagerToolbarComponent signal API', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let dataManagerService: SkyDataManagerService;
  let loader: HarnessLoader;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        SkyDataManagerService,
        SkyDataManagerColumnPickerService,
        SkyUIConfigService,
      ],
    });
    dataManagerService = TestBed.inject(SkyDataManagerService);
    fixture = TestBed.createComponent(TestHostComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('seeds the data manager state from its models on init', fakeAsync(() => {
    fixture.componentInstance.searchText = 'mango';
    fixture.componentInstance.page = 2;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(dataManagerService.state().searchText).toBe('mango');
    expect(dataManagerService.state().page).toBe(2);
  }));

  it('pushes model changes into the data manager state', () => {
    fixture.detectChanges();

    fixture.componentInstance.selectedIds = ['1', '2'];
    fixture.detectChanges();

    expect(dataManagerService.state().selectedIds).toEqual(['1', '2']);
  });

  it('resets page to 1 when searchText changes', fakeAsync(() => {
    fixture.componentInstance.page = 4;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(dataManagerService.state().page).toBe(4);

    fixture.componentInstance.searchText = 'lime';
    fixture.detectChanges();

    expect(dataManagerService.state().searchText).toBe('lime');
    expect(dataManagerService.state().page).toBe(1);
    expect(fixture.componentInstance.page).toBe(1);
  }));

  it('does not reset page when selectedIds changes', fakeAsync(() => {
    fixture.componentInstance.page = 4;
    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    fixture.componentInstance.selectedIds = ['1'];
    fixture.detectChanges();

    expect(dataManagerService.state().page).toBe(4);
  }));

  it('reflects externally-driven state changes back into its models', () => {
    fixture.detectChanges();

    dataManagerService.updateState({
      searchText: 'banana',
      selectedIds: ['9'],
    });
    fixture.detectChanges();

    expect(fixture.componentInstance.searchText).toBe('banana');
    expect(fixture.componentInstance.selectedIds).toEqual(['9']);
  });

  it('does not seed state when initDataManager() already initialized the service', () => {
    dataManagerService.initDataManager({
      activeViewId: 'view1',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({ searchText: 'preexisting' }),
    });

    fixture.componentInstance.searchText = 'shouldNotSeed';
    fixture.detectChanges();
    // Flush the afterNextRender() callback that runs the seeding check.
    fixture.detectChanges();

    expect(dataManagerService.state().searchText).toBe('preexisting');
  });

  it('feeds totalCount into the data summary pipeline', () => {
    let receivedTotal: number | undefined;
    dataManagerService
      .getDataSummaryUpdates('someOtherSource')
      .subscribe((summary) => (receivedTotal = summary.totalItems));

    fixture.detectChanges();
    fixture.componentInstance.totalCount = 42;
    fixture.detectChanges();

    expect(receivedTotal).toBe(42);
  });

  it('does not announce a data summary on initial construction when totalCount has not been explicitly changed', () => {
    const updateDataSummarySpy = spyOn(dataManagerService, 'updateDataSummary');

    fixture.detectChanges();

    expect(updateDataSummarySpy).not.toHaveBeenCalled();

    fixture.componentInstance.totalCount = 7;
    fixture.detectChanges();

    expect(updateDataSummarySpy).toHaveBeenCalledWith(
      { totalItems: 7, itemsMatching: 7 },
      'toolbar',
    );
  });

  it('renders the search box with no activeView, using searchPlaceholderText', async () => {
    fixture.detectChanges();

    const search = await loader.getHarness(SkySearchHarness);

    expect(search).toBeTruthy();
    expect(await search.getPlaceholderText()).toBe('Search fruit');
  });

  it('renders projected sky-data-manager-sort-option elements in the sort menu', async () => {
    fixture.detectChanges();

    const sort = await loader.getHarness(SkySortHarness);
    await sort.click();
    const items = await sort.getItems();

    expect(items.length).toBe(1);
    expect(await items[0].getText()).toContain('Name (A - Z)');
  });

  it('updates the sort model when a projected sort option is selected', async () => {
    fixture.detectChanges();

    const sort = await loader.getHarness(SkySortHarness);
    await sort.click();
    const item = await sort.getItem({ text: 'Name (A - Z)' });
    await item.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.sort).toEqual({
      id: 'az',
      propertyName: 'name',
      label: 'Name (A - Z)',
      descending: false,
    });
  });
});

@Component({
  selector: 'sky-test-host-sort-page-size',
  template: `
    <sky-data-manager-toolbar
      [settingsKey]="settingsKey"
      [(sort)]="sort"
      [(pageSize)]="pageSize"
      [(filters)]="filters"
    />
  `,
  imports: [SkyDataManagerToolbarComponent],
})
class TestHostSortPageSizeComponent {
  public settingsKey: string | undefined;
  public sort:
    | { id: string; propertyName: string; label: string; descending: boolean }
    | undefined;
  public pageSize: number | undefined;
  public filters: SkyFilterState | undefined;
}

describe('SkyDataManagerToolbarComponent signal API (sort, pageSize, settingsKey)', () => {
  let fixture: ComponentFixture<TestHostSortPageSizeComponent>;
  let dataManagerService: SkyDataManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostSortPageSizeComponent],
      providers: [
        SkyDataManagerService,
        SkyDataManagerColumnPickerService,
        SkyUIConfigService,
      ],
    });
    dataManagerService = TestBed.inject(SkyDataManagerService);
    fixture = TestBed.createComponent(TestHostSortPageSizeComponent);
  });

  it('pushes sort model changes into the data manager state', () => {
    fixture.detectChanges();

    fixture.componentInstance.sort = {
      id: '1',
      propertyName: 'name',
      label: 'Name',
      descending: false,
    };
    fixture.detectChanges();

    expect(dataManagerService.state().activeSortOption).toEqual({
      id: '1',
      propertyName: 'name',
      label: 'Name',
      descending: false,
    });
  });

  it('pushes pageSize model changes into the data manager state', () => {
    fixture.detectChanges();

    fixture.componentInstance.pageSize = 50;
    fixture.detectChanges();

    expect(dataManagerService.state().pageSize).toBe(50);
  });

  it('reflects externally-driven pageSize changes back into the model', () => {
    fixture.detectChanges();
    // A second `detectChanges()` here flushes the `afterNextRender()` seeding
    // check (see the "does not seed" test above) before any further state
    // changes happen, so the seed check --- which reads this toolbar's
    // models as they stood at the time it runs --- can't race with, and
    // clobber, the `updateState()` call below.
    fixture.detectChanges();

    dataManagerService.updateState({ pageSize: 75 });
    fixture.detectChanges();

    expect(dataManagerService.state().pageSize).toBe(75);
  });

  it('persists and restores state through a settingsKey via SkyUIConfigService', () => {
    fixture.componentInstance.settingsKey = 'my-settings-key';
    fixture.detectChanges();

    dataManagerService.updateState({ searchText: 'abc' });
    fixture.detectChanges();

    expect(dataManagerService.state().searchText).toBe('abc');
  });

  it('reads the initial state from SkyUIConfigService.getConfig and writes changes back via setConfig, both keyed by settingsKey', () => {
    const uiConfigService = TestBed.inject(SkyUIConfigService);
    const getConfigSpy = spyOn(uiConfigService, 'getConfig').and.callThrough();
    const setConfigSpy = spyOn(uiConfigService, 'setConfig').and.callThrough();

    fixture.componentInstance.settingsKey = 'my-settings-key';
    fixture.detectChanges();

    expect(getConfigSpy).toHaveBeenCalledWith(
      'my-settings-key',
      jasmine.objectContaining({
        searchText: '',
        activeSortOption: undefined,
        selectedIds: [],
        page: 1,
      }),
    );

    // The initial `getConfig()` read itself round-trips back through
    // `setConfig()` (writing back the same default state it just read), so
    // reset the spy here to isolate the write triggered by the state change
    // below from that initial persistence round-trip.
    setConfigSpy.calls.reset();

    dataManagerService.updateState({ searchText: 'xyz' });
    fixture.detectChanges();

    expect(setConfigSpy).toHaveBeenCalledWith(
      'my-settings-key',
      jasmine.objectContaining({ searchText: 'xyz' }),
    );
  });

  it('logs an error when unable to save settings through a settingsKey', () => {
    const uiConfigService = TestBed.inject(SkyUIConfigService);
    spyOn(uiConfigService, 'setConfig').and.returnValue(
      throwError(() => new Error('something went wrong')),
    );
    spyOn(console, 'warn');

    fixture.componentInstance.settingsKey = 'my-settings-key';
    fixture.detectChanges();

    dataManagerService.updateState({ searchText: 'abc' });
    fixture.detectChanges();

    expect(console.warn).toHaveBeenCalled();
  });

  it('seeds filterData from a truthy filters model, deriving filtersApplied from appliedFilters', () => {
    fixture.componentInstance.filters = {
      appliedFilters: [{ filterId: 'a', filterValue: { value: 'x' } }],
    };
    fixture.detectChanges();

    expect(dataManagerService.state().filterData).toEqual({
      filtersApplied: true,
      filters: {
        appliedFilters: [{ filterId: 'a', filterValue: { value: 'x' } }],
      },
    });
  });

  it('seeds filtersApplied as false when the filters model has no applied filters, even though it is truthy', () => {
    fixture.componentInstance.filters = { selectedFilterIds: ['a'] };
    fixture.detectChanges();

    expect(dataManagerService.state().filterData).toEqual({
      filtersApplied: false,
      filters: { selectedFilterIds: ['a'] },
    });
  });

  it('seeds filtersApplied as false when the filters model has an empty appliedFilters array', () => {
    fixture.componentInstance.filters = { appliedFilters: [] };
    fixture.detectChanges();

    expect(dataManagerService.state().filterData).toEqual({
      filtersApplied: false,
      filters: { appliedFilters: [] },
    });
  });

  it('pushes filters model changes into state, including clearing back to undefined', () => {
    fixture.detectChanges();

    fixture.componentInstance.filters = {
      appliedFilters: [{ filterId: 'a', filterValue: { value: 'x' } }],
    };
    fixture.detectChanges();

    expect(dataManagerService.state().filterData).toEqual({
      filtersApplied: true,
      filters: {
        appliedFilters: [{ filterId: 'a', filterValue: { value: 'x' } }],
      },
    });

    fixture.componentInstance.filters = undefined;
    fixture.detectChanges();

    expect(dataManagerService.state().filterData).toBeUndefined();
  });
});

@Component({
  selector: 'sky-test-host-filter-controller',
  template: `
    <sky-data-manager-toolbar [(filters)]="filters" />
    <div skyDataManagerFilterController></div>
  `,
  imports: [
    SkyDataManagerToolbarComponent,
    SkyDataManagerFilterControllerDirective,
  ],
})
class TestHostFilterControllerComponent {
  public filters: SkyFilterState | undefined;
}

describe('SkyDataManagerToolbarComponent signal API (filter-bar integration via SkyDataManagerFilterControllerDirective)', () => {
  let fixture: ComponentFixture<TestHostFilterControllerComponent>;
  let dataManagerService: SkyDataManagerService;
  let filterStateService: SkyFilterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestHostFilterControllerComponent],
      providers: [
        SkyDataManagerService,
        SkyDataManagerColumnPickerService,
        SkyUIConfigService,
      ],
    });
    dataManagerService = TestBed.inject(SkyDataManagerService);
    fixture = TestBed.createComponent(TestHostFilterControllerComponent);
    fixture.detectChanges();

    // The adapter service is provided by the directive itself (useExisting on
    // SkyFilterStateService), so retrieve it from the directive's element
    // injector rather than the root TestBed injector.
    const directiveDebugEl = fixture.debugElement.query(
      By.directive(SkyDataManagerFilterControllerDirective),
    );
    filterStateService = directiveDebugEl.injector.get(SkyFilterStateService);
  });

  it('derives filtersApplied as false when the filter bar reports an empty appliedFilters array', () => {
    filterStateService.updateFilterState(
      { appliedFilters: [] },
      'test-filter-bar',
    );
    fixture.detectChanges();

    expect(dataManagerService.state().filterData?.filtersApplied).toBeFalse();
  });

  it('derives filtersApplied as true once the filter bar reports a real applied filter', () => {
    filterStateService.updateFilterState(
      { appliedFilters: [{ filterId: 'a', filterValue: { value: 'x' } }] },
      'test-filter-bar',
    );
    fixture.detectChanges();

    expect(dataManagerService.state().filterData?.filtersApplied).toBeTrue();
    expect(fixture.componentInstance.filters?.appliedFilters).toEqual([
      { filterId: 'a', filterValue: { value: 'x' } },
    ]);
  });
});
