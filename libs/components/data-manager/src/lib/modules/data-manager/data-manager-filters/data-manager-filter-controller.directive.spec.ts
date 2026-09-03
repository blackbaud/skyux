import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyFilterStateFilterItem } from '@skyux/lists';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';

import { SkyDataManagerFilterControllerDirective } from './data-manager-filter-controller.directive';
import { SkyDataManagerFilterStateService } from './data-manager-filter-state.service';

@Component({
  template: `<div skyDataManagerFilterController></div>`,
  imports: [SkyDataManagerFilterControllerDirective],
})
class TestComponent {}

describe('SkyDataManagerFilterControllerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dataManagerService: SkyDataManagerService;
  let filterStateService: SkyDataManagerFilterStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [SkyDataManagerService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    // The adapter service is provided by the directive itself (useExisting on SkyFilterStateService).
    // Retrieve it from the element injector rather than the root TestBed injector.
    const directiveDebugEl = fixture.debugElement.query(
      By.directive(SkyDataManagerFilterControllerDirective),
    );
    filterStateService = directiveDebugEl.injector.get(
      SkyDataManagerFilterStateService,
    );

    // Initialize the data manager
    dataManagerService.initDataManager({
      activeViewId: 'test-view',
      dataManagerConfig: {},
      defaultDataState: new SkyDataManagerState({}),
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should provide adapter service', () => {
    expect(filterStateService).toBeTruthy();
    expect(filterStateService).toBeInstanceOf(SkyDataManagerFilterStateService);
  });

  it('should update data manager when adapter filters change', () => {
    const spy = spyOn(dataManagerService, 'updateDataState');
    const filters: SkyFilterStateFilterItem[] = [
      {
        filterId: 'test-filter',
        filterValue: { value: 'test-value' },
      },
    ];
    filterStateService.updateFilterState(
      { appliedFilters: filters },
      'test-list',
    );
    expect(spy).toHaveBeenCalled();
  });

  it('should update adapter when data manager state changes', () => {
    const spy = spyOn(filterStateService, 'updateFilterState');

    // Update data manager state
    const newState = new SkyDataManagerState({
      filterData: {
        filtersApplied: true,
        filters: [
          {
            filterId: 'test-filter',
            filterValue: { value: 'new-value' },
          },
        ],
      },
    });

    dataManagerService.updateDataState(newState, 'test-source');
    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
  });

  it('should notify property-filtered subscribers of each consecutive filter change', () => {
    const emissions: SkyDataManagerState[] = [];

    dataManagerService
      .getDataStateUpdates('testSubscriber', { properties: ['filterData'] })
      .subscribe((state) => emissions.push(state));

    const countAfterInit = emissions.length;

    filterStateService.updateFilterState(
      {
        appliedFilters: [
          { filterId: 'test-filter', filterValue: { value: 'one' } },
        ],
      },
      'test-list',
    );

    filterStateService.updateFilterState(
      {
        appliedFilters: [
          { filterId: 'test-filter', filterValue: { value: 'two' } },
        ],
      },
      'test-list',
    );

    expect(emissions.length).toBe(countAfterInit + 2);
    expect(
      emissions[emissions.length - 1].filterData?.filters.appliedFilters[0]
        .filterValue.value,
    ).toBe('two');
  });

  it('should not mutate the data state instance it received when publishing filter changes', () => {
    let peerState!: SkyDataManagerState;
    dataManagerService
      .getDataStateUpdates('peer')
      .subscribe((state) => (peerState = state));

    const previouslyEmittedState = peerState;
    const filterDataBefore = previouslyEmittedState.filterData;

    filterStateService.updateFilterState(
      {
        appliedFilters: [
          { filterId: 'test-filter', filterValue: { value: 'changed' } },
        ],
      },
      'test-list',
    );

    expect(previouslyEmittedState.filterData).toBe(filterDataBefore);
  });
});
