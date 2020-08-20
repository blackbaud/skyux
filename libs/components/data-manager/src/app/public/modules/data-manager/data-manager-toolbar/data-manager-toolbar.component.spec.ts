import {
  Component
} from '@angular/core';

import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  SkyCheckboxChange
} from '@skyux/forms';

import {
  SkyModalService
} from '@skyux/modals';

import {
  expect
} from '@skyux-sdk/testing';

import {
  Subject
} from 'rxjs';

import {
  DataManagerFixtureModule
} from '../fixtures/data-manager.module.fixture';

import {
  SkyDataManagerToolbarComponent
} from './data-manager-toolbar.component';

import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataViewConfig,
  SkyDataViewState
} from '../../../public_api';
import { SkyDataManagerState } from '../models/data-manager-state';

class MockModalService {
  public closeCallback: Function;

  constructor() { }
  public open(): any {
    return {
      closed: {
        subscribe: (callback: Function) => {
          this.closeCallback = callback;
        }
      }
    };
  }
}

@Component({})
class MockModalComponent { }

describe('SkyDataManagerToolbarComponent', () => {
  let dataManagerToolbarFixture: ComponentFixture<SkyDataManagerToolbarComponent>;
  let dataManagerToolbarComponent: SkyDataManagerToolbarComponent;
  let dataManagerToolbarNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;
  let modalServiceInstance: MockModalService;
  let viewConfig: SkyDataViewConfig;

  beforeEach(() => {
    modalServiceInstance = new MockModalService();

    TestBed.configureTestingModule({
      imports: [
        DataManagerFixtureModule,
        SkyDataManagerModule
      ],
      providers: [
        {
          provide: SkyModalService,
          useValue: modalServiceInstance
        }
      ]
    });

    dataManagerToolbarFixture = TestBed.createComponent(SkyDataManagerToolbarComponent);
    dataManagerToolbarNativeElement = dataManagerToolbarFixture.nativeElement;
    dataManagerToolbarComponent = dataManagerToolbarFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    viewConfig = {
      id: 'cardsView',
      name: 'test view'
    };
    dataManagerToolbarComponent.activeView = viewConfig;
    dataManagerToolbarComponent.dataState = new SkyDataManagerState({});
  });

  it('should show a sort button if the data view config has sort enabled', () => {
    dataManagerToolbarComponent.activeView.sortEnabled = true;
    dataManagerToolbarFixture.detectChanges();

    const sortDropdownBtn = dataManagerToolbarNativeElement.querySelector('sky-sort button');

    expect(sortDropdownBtn).toBeVisible();
  });

  it('should not show a sort button if the data view config does not have sort enabled', () => {
    dataManagerToolbarComponent.activeView.sortEnabled = false;
    dataManagerToolbarFixture.detectChanges();

    const sortDropdown = dataManagerToolbarNativeElement.querySelector('sky-sort');

    expect(sortDropdown).toBeNull();
  });

  it('should return the active sort option id', () => {
    const activeSortOption = {
      descending: true,
      id: 'name-za',
      label: 'Name (Z-A)',
      propertyName: 'name'
    };
    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataState.activeSortOption = activeSortOption;

    expect(dataManagerToolbarComponent.activeSortOptionId).toEqual(activeSortOption.id);
  });

  it('should show a column picker button if the data view config has column picker enabled', () => {
    dataManagerToolbarComponent.activeView.columnPickerEnabled = true;
    dataManagerToolbarFixture.detectChanges();

    const colPickerBtn = dataManagerToolbarNativeElement.querySelector('.sky-col-picker-btn');

    expect(colPickerBtn).toBeVisible();
  });

  it('should not show a column picker button if the data view config does not have column picker enabled', () => {
    dataManagerToolbarComponent.activeView.columnPickerEnabled = false;
    dataManagerToolbarFixture.detectChanges();

    const colPickerBtn = dataManagerToolbarNativeElement.querySelector('.sky-col-picker-btn');

    expect(colPickerBtn).toBeNull();
  });

  it('should show a filter button if the data view config has filters enabled', () => {
    dataManagerToolbarComponent.activeView.filterButtonEnabled = true;
    dataManagerToolbarFixture.detectChanges();

    const filterBtn = dataManagerToolbarNativeElement.querySelector('sky-filter-button');

    expect(filterBtn).toBeVisible();
  });

  it('should not show a filter button if the data view config does not have filters enabled', () => {
    dataManagerToolbarComponent.activeView.filterButtonEnabled = false;
    dataManagerToolbarFixture.detectChanges();

    const filterBtn = dataManagerToolbarNativeElement.querySelector('sky-filter-button');

    expect(filterBtn).toBeNull();
  });

  it('should show a search box if the data view config has search enabled', () => {
    dataManagerToolbarComponent.activeView.searchEnabled = true;
    dataManagerToolbarFixture.detectChanges();

    const search = dataManagerToolbarNativeElement.querySelector('sky-search');

    expect(search).toBeVisible();
  });

  it('should not show a search box if the data view config does not have search enabled', () => {
    dataManagerToolbarComponent.activeView.searchEnabled = false;
    dataManagerToolbarFixture.detectChanges();

    const search = dataManagerToolbarNativeElement.querySelector('sky-search');

    expect(search).toBeNull();
  });

  it('should show a multiselect toolbar if the data view config has multiselect enabled', () => {
    dataManagerToolbarComponent.activeView.multiselectToolbarEnabled = true;
    dataManagerToolbarFixture.detectChanges();

    const multiselectToolbar = dataManagerToolbarNativeElement.querySelector('.sky-data-manager-multiselect-toolbar');

    expect(multiselectToolbar).toBeVisible();
  });

  it('should not show a multiselect toolbar if the data view config does not have multiselect enabled', () => {
    dataManagerToolbarComponent.activeView.multiselectToolbarEnabled = false;
    dataManagerToolbarFixture.detectChanges();

    const multiselectToolbar = dataManagerToolbarNativeElement.querySelector('.sky-data-manager-multiselect-toolbar');

    expect(multiselectToolbar).toBeNull();
  });

  it('should call the active view\'s onSelectAllClick function when select all is clicked', () => {
    const selectAllSpy = jasmine.createSpy();
    const activeView = dataManagerToolbarComponent.activeView;
    activeView.multiselectToolbarEnabled = true;
    activeView.onSelectAllClick = selectAllSpy;
    dataManagerToolbarFixture.detectChanges();

    const selectAllBtn = dataManagerToolbarNativeElement.querySelector('.sky-data-manager-select-all-btn') as HTMLButtonElement;
    selectAllBtn.click();

    expect(selectAllSpy).toHaveBeenCalled();
  });

  it('should call the active view\'s onClearAllClick function when clear all is clicked', () => {
    const clearAllSpy = jasmine.createSpy();
    const activeView = dataManagerToolbarComponent.activeView;
    activeView.multiselectToolbarEnabled = true;
    activeView.onClearAllClick = clearAllSpy;
    dataManagerToolbarFixture.detectChanges();

    const clearAllBtn = dataManagerToolbarNativeElement.querySelector('.sky-data-manager-clear-all-btn') as HTMLButtonElement;
    clearAllBtn.click();

    expect(clearAllSpy).toHaveBeenCalled();
  });

  it('should update the data state when the only show selected checkbox state changes', () => {
    dataManagerToolbarFixture.detectChanges();

    const event = { checked: true } as SkyCheckboxChange;
    let updatedDataState = dataManagerToolbarComponent.dataState;
    updatedDataState.onlyShowSelected = true;
    spyOn(dataManagerService, 'updateDataState');

    dataManagerToolbarComponent.onOnlyShowSelected(event);

    expect(dataManagerToolbarComponent.dataState.onlyShowSelected).toBeTrue();
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(updatedDataState, 'toolbar');
  });

  it('should retrieve the active view when the data manager service emits a new active view id', () => {
    const activeViewIdObservable = new Subject<string>();
    const nextId = 'test';
    spyOn(dataManagerService, 'getActiveViewIdUpdates').and.returnValue(activeViewIdObservable);
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
      propertyName: 'name'
    };

    dataManagerToolbarFixture.detectChanges();

    let dataState = dataManagerToolbarComponent.dataState;
    dataState.activeSortOption = sortOption;
    dataManagerToolbarComponent.sortSelected(sortOption);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, 'toolbar');
  });

  it('should update the data state when text is searched', () => {
    spyOn(dataManagerService, 'updateDataState');
    const searchText = 'testing';

    dataManagerToolbarFixture.detectChanges();

    let dataState = dataManagerToolbarComponent.dataState;
    dataState.searchText = searchText;
    dataManagerToolbarComponent.searchApplied(searchText);

    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, 'toolbar');
  });

  it('should update the active view id via the data manager service when the view changes', () => {
    const newViewId = 'testId';
    spyOn(dataManagerService, 'updateActiveViewId');

    dataManagerToolbarComponent.onViewChange(newViewId);

    expect(dataManagerService.updateActiveViewId).toHaveBeenCalledWith(newViewId);
  });

  it('should open the provided filter modal when the filter button is clicked', () => {
    const mockModal = new MockModalComponent();
    spyOn(modalServiceInstance, 'open').and.callThrough();
    dataManagerToolbarComponent.activeView.filterButtonEnabled = true;

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = { filterModalComponent: mockModal };
    const filterBtn = dataManagerToolbarNativeElement.querySelector('sky-filter-button button') as HTMLButtonElement;

    filterBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalled();
  });

  it('should save the returned filter data when the provided filter modal is saved', () => {
    const mockModal = new MockModalComponent();
    const filterData = { filtersApplied: false, filters: {test: 'test' }};
    spyOn(dataManagerService, 'updateDataState');
    dataManagerToolbarComponent.activeView.filterButtonEnabled = true;

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = { filterModalComponent: mockModal };
    const filterBtn = dataManagerToolbarNativeElement.querySelector('sky-filter-button button') as HTMLButtonElement;
    const dataState = dataManagerToolbarComponent.dataState;

    filterBtn.click();

    modalServiceInstance.closeCallback({
      reason: 'save',
      data: filterData
    });

    expect(dataManagerToolbarComponent.dataState.filterData).toEqual(filterData);
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, 'toolbar');
  });

  it('should not save the returned filter data when the provided filter modal is canceled', () => {
    const mockModal = new MockModalComponent();
    spyOn(dataManagerService, 'updateDataState');
    dataManagerToolbarComponent.activeView.filterButtonEnabled = true;

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.dataManagerConfig = { filterModalComponent: mockModal };
    const filterBtn = dataManagerToolbarNativeElement.querySelector('sky-filter-button button') as HTMLButtonElement;

    filterBtn.click();

    modalServiceInstance.closeCallback({
      reason: 'cancel'
    });

    expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
  });

  it('should not open a modal when the filter button is clicked if none is provided', () => {
    spyOn(modalServiceInstance, 'open');
    dataManagerToolbarComponent.activeView.filterButtonEnabled = true;

    dataManagerToolbarFixture.detectChanges();

    const filterBtn = dataManagerToolbarNativeElement.querySelector('sky-filter-button button') as HTMLButtonElement;
    filterBtn.click();

    expect(modalServiceInstance.open).not.toHaveBeenCalled();
  });

  it('should open the column picker modal when the column picker button is clicked', () => {
    const viewState = new SkyDataViewState({
      viewId: viewConfig.id
    });
    spyOn(modalServiceInstance, 'open').and.callThrough();
    dataManagerToolbarComponent.activeView.columnPickerEnabled = true;

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.activeView.columnOptions = [];
    dataManagerToolbarComponent.dataState.views = [viewState];
    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector('.sky-col-picker-btn') as HTMLButtonElement;

    columnPickerBtn.click();

    expect(modalServiceInstance.open).toHaveBeenCalled();
  });

  it('should save the returned column data when the column picker modal is saved', () => {
    const viewState = new SkyDataViewState({
      viewId: viewConfig.id
    });
    spyOn(dataManagerService, 'updateDataState');
    dataManagerToolbarComponent.activeView.columnPickerEnabled = true;

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.activeView.columnOptions = [];
    dataManagerToolbarComponent.dataState.views = [viewState];

    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector('.sky-col-picker-btn') as HTMLButtonElement;
    const dataState = dataManagerToolbarComponent.dataState;

    columnPickerBtn.click();

    modalServiceInstance.closeCallback({
      reason: 'save',
      data: [{id: '1', label: 'Column 1'}]
    });
    viewState.displayedColumnIds = ['1'];
    dataState.views = [viewState];

    expect(dataManagerToolbarComponent.dataState.getViewStateById(viewConfig.id)).toEqual(viewState);
    expect(dataManagerService.updateDataState).toHaveBeenCalledWith(dataState, 'toolbar');
  });

  it('should not save the returned column data when the column picker modal is canceled', () => {
    const viewState = new SkyDataViewState({
      viewId: viewConfig.id
    });
    spyOn(dataManagerService, 'updateDataState');
    dataManagerToolbarComponent.activeView.columnPickerEnabled = true;

    dataManagerToolbarFixture.detectChanges();

    dataManagerToolbarComponent.activeView.columnOptions = [];
    dataManagerToolbarComponent.dataState.views = [viewState];
    const columnPickerBtn = dataManagerToolbarNativeElement.querySelector('.sky-col-picker-btn') as HTMLButtonElement;

    columnPickerBtn.click();

    modalServiceInstance.closeCallback({
      reason: 'cancel'
    });

    expect(dataManagerService.updateDataState).not.toHaveBeenCalled();
  });

  it('should pass accessibility', async(() => {
    expect(dataManagerToolbarNativeElement).toBeAccessible();
  }));
});
