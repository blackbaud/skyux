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
  SkyDataManagerColumnPickerSortStrategy,
  SkyDataManagerService,
  SkyDataManagerState,
  SkyDataViewConfig,
  SkyDataViewState,
} from '@skyux/data-manager';
import { SkyModalConfigurationInterface, SkyModalService } from '@skyux/modals';

import { Subject } from 'rxjs';

import { SkyDataManagerColumnPickerContext } from '../data-manager-column-picker/data-manager-column-picker-context';
import { SkyDataManagerColumnPickerComponent } from '../data-manager-column-picker/data-manager-column-picker.component';
import { DataManagerFixtureComponent } from '../fixtures/data-manager.component.fixture';
import { DataManagerFixtureModule } from '../fixtures/data-manager.module.fixture';
import { SkyDataManagerColumnPickerOption } from '../models/data-manager-column-picker-option';

import { SkyDataManagerToolbarComponent } from './data-manager-toolbar.component';

class MockModalService {
  public closeCallback:
    | ((args: { reason: string; data?: unknown }) => void)
    | undefined;

  public open(): {
    closed: {
      subscribe: (
        callback: (args: { reason: string; data?: unknown }) => void
      ) => void;
    };
  } {
    return {
      closed: {
        subscribe: (
          callback: (args: { reason: string; data?: unknown }) => void
        ): void => {
          this.closeCallback = callback;
        },
      },
    };
  }
}

@Component({})
class MockModalComponent {}

describe('SkyDataManagerToolbarComponent', () => {
  let dataManagerToolbarFixture: ComponentFixture<SkyDataManagerToolbarComponent>;
  let dataManagerToolbarComponent: SkyDataManagerToolbarComponent;
  let dataManagerToolbarNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;
  let modalServiceInstance: MockModalService;
  let viewConfig: SkyDataViewConfig;

  function setSearchInput(text: string): void {
    const inputEl = dataManagerToolbarFixture.debugElement.query(
      By.css('input')
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
      By.css('.sky-search-container input')
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
      By.css('.sky-search-btn-apply')
    );
    SkyAppTestUtility.fireDomEvent(applyEl.nativeElement, 'click');
    dataManagerToolbarFixture.detectChanges();
  }

  beforeEach(() => {
    modalServiceInstance = new MockModalService();

    TestBed.configureTestingModule({
      imports: [DataManagerFixtureModule],
      providers: [
        {
          provide: SkyModalService,
          useValue: modalServiceInstance,
        },
      ],
    });

    dataManagerToolbarFixture = TestBed.createComponent(
      SkyDataManagerToolbarComponent
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
      DataManagerFixtureComponent
    );
    const dataManagerNativeElement = dataManagerFixture.nativeElement;
    dataManagerFixture.detectChanges();

    const primaryButton = dataManagerNativeElement.querySelector(
      '.primary-test-button'
    );
    const leftButton =
      dataManagerNativeElement.querySelector('.left-test-button');
    const rightButton =
      dataManagerNativeElement.querySelector('.right-test-button');

    expect(primaryButton).toBeVisible();
    expect(leftButton).toBeVisible();
    expect(rightButton).toBeVisible();
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
      '.sky-col-picker-btn'
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
      '.sky-col-picker-btn'
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
      '.sky-data-manager-multiselect-toolbar'
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
      '.sky-data-manager-multiselect-toolbar'
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
      '.sky-data-manager-select-all-btn'
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
      '.sky-data-manager-clear-all-btn'
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
        .onlyShowSelected
    ).toBeTrue();
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      updatedDataState,
      'toolbar'
    );
  });

  it('should retrieve the active view when the data manager service emits a new active view id', () => {
    const activeViewIdObservable = new Subject<string>();
    const nextId = 'test';
    spyOn(dataManagerService, 'getActiveViewIdUpdates').and.returnValue(
      activeViewIdObservable
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
      'toolbar'
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
      'toolbar'
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
      'toolbar'
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
      'toolbar'
    );
  }));

  it('should update the active view id via the data manager service when the view changes', () => {
    const newViewId = 'testId';
    spyOn(dataManagerService, 'updateActiveViewId');

    dataManagerToolbarComponent.onViewChange(newViewId);

    expect(dataManagerService.updateActiveViewId).toHaveBeenCalledWith(
      newViewId
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
      'sky-filter-button button'
    ) as HTMLButtonElement;

    expect(filterBtn).toBeFalsy();

    dataManagerService.updateViewConfig({
      ...(dataManagerService.getViewById('cardsView') as SkyDataViewConfig),
      filterButtonEnabled: true,
    });

    dataManagerToolbarFixture.detectChanges();

    filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button'
    ) as HTMLButtonElement;

    expect(filterBtn).toExist();
  });

  it('should open the provided filter modal when the filter button is clicked', () => {
    const mockModal = new MockModalComponent();
    spyOn(modalServiceInstance, 'open').and.callThrough();
    spyOn(dataManagerService, 'getViewById').and.returnValue({
      ...(dataManagerToolbarComponent.activeView as SkyDataViewConfig),
      filterButtonEnabled: true,
    });

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = {
      filterModalComponent: mockModal,
    };

    const filterBtn = dataManagerToolbarNativeElement.querySelector(
      'sky-filter-button button'
    ) as HTMLButtonElement;

    filterBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalled();
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
      'sky-filter-button button'
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
      filterData
    );
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar'
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
      'sky-filter-button button'
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
      'sky-filter-button button'
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
      viewState.displayedColumnIds
    );
    const options: SkyModalConfigurationInterface = {
      providers: [
        {
          provide: SkyDataManagerColumnPickerContext,
          useValue: context,
        },
      ],
    };

    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn'
    ) as HTMLButtonElement;

    columnPickerBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalledWith(
      SkyDataManagerColumnPickerComponent,
      options
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
      SkyDataManagerColumnPickerSortStrategy.None
    );
    const options: SkyModalConfigurationInterface = {
      providers: [
        {
          provide: SkyDataManagerColumnPickerContext,
          useValue: context,
        },
      ],
    };

    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector(
      '.sky-col-picker-btn'
    ) as HTMLButtonElement;

    columnPickerBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalledWith(
      SkyDataManagerColumnPickerComponent,
      options
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
      '.sky-col-picker-btn'
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
      dataManagerToolbarComponent.dataState?.getViewStateById(viewConfig.id)
    ).toEqual(viewState);
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(
      dataState,
      'toolbar'
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
      '.sky-col-picker-btn'
    ) as HTMLButtonElement;

    columnPickerBtn.click();

    if (modalServiceInstance.closeCallback) {
      modalServiceInstance.closeCallback({
        reason: 'cancel',
      });
    }

    expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
  });

  it('should pass accessibility', async () => {
    await expectAsync(dataManagerToolbarNativeElement).toBeAccessible();
  });
});
