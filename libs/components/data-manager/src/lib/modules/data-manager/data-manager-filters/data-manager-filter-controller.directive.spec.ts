import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyFilterAdapterFilterItem,
  SkyFilterAdapterService,
} from '@skyux/lists';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';

import { SkyDataManagerFilterAdapterService } from './data-manager-filter-adapter.service';
import { SkyDataManagerFilterControllerDirective } from './data-manager-filter-controller.directive';

@Component({
  template: `<div skyDataManagerFilterController></div>`,
  imports: [SkyDataManagerFilterControllerDirective],
  providers: [SkyDataManagerService],
})
class TestComponent {}

describe('SkyDataManagerFilterControllerDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let dataManagerService: SkyDataManagerService;
  let adapterService: SkyDataManagerFilterAdapterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    adapterService = TestBed.inject(
      SkyFilterAdapterService,
    ) as SkyDataManagerFilterAdapterService;

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
    expect(adapterService).toBeTruthy();
    expect(adapterService).toBeInstanceOf(SkyDataManagerFilterAdapterService);
  });

  it('should update data manager when adapter filters change', () => {
    const spy = spyOn(dataManagerService, 'updateDataState');
    const filters: SkyFilterAdapterFilterItem[] = [
      {
        filterId: 'test-filter',
        filterValue: { value: 'test-value' },
      },
    ];
    adapterService.updateFilterData({ appliedFilters: filters }, 'test-list');
    expect(spy).toHaveBeenCalled();
  });

  it('should update adapter when data manager state changes', () => {
    const spy = spyOn(adapterService, 'updateFilterData');

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
});
