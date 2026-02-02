import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyDataHost } from '@skyux/lists';

import { SkyDataManagerService } from '../data-manager.service';
import { SkyDataManagerState } from '../models/data-manager-state';

import { SkyDataManagerHostControllerDirective } from './data-manager-host-controller.directive';
import { SkyDataManagerHostService } from './data-manager-host.service';

@Component({
  template: `<div skyDataManagerHostController [viewId]="viewId"></div>`,
  imports: [SkyDataManagerHostControllerDirective],
})
class TestHostComponent {
  public viewId = 'test-view';
}

describe('SkyDataManagerHostControllerDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let dataManagerService: SkyDataManagerService;
  let adapterService: SkyDataManagerHostService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [SkyDataManagerService],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    fixture.detectChanges();

    const directiveDebugEl = fixture.debugElement.query(
      By.directive(SkyDataManagerHostControllerDirective),
    );
    adapterService = directiveDebugEl.injector.get(SkyDataManagerHostService);
  });

  it('should create and provide the adapter service', () => {
    expect(component).toBeTruthy();
    expect(adapterService).toBeTruthy();
    expect(adapterService).toBeInstanceOf(SkyDataManagerHostService);
  });

  it('should update the adapter when the data manager state includes the view', async () => {
    const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

    const newState = new SkyDataManagerState({
      activeSortOption: undefined,
      searchText: 'search-text',
      selectedIds: ['1', '2'],
      views: [
        {
          viewId: component.viewId,
          displayedColumnIds: ['col-1'],
          additionalData: {
            page: 3,
          },
        },
      ],
    });

    const sourceId = 'host-controller-test';
    dataManagerService.updateDataState(newState, sourceId);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy).toHaveBeenCalled();
    const [hostState, id] = spy.calls.mostRecent().args;
    expect(id).toBe('skyDataManagerHostController');
    expect(hostState).toEqual(
      jasmine.objectContaining({
        id: component.viewId,
        searchText: 'search-text',
        selectedIds: ['1', '2'],
        page: 3,
        displayedColumnIds: ['col-1'],
        activeSortOption: undefined,
      }),
    );
  });

  it('should propagate adapter changes back into the data manager state', async () => {
    dataManagerService.updateDataManagerConfig({
      sortOptions: [
        {
          id: 'name-sort',
          label: 'Name',
          propertyName: 'name',
          descending: true,
        },
      ],
    });

    const initialState = new SkyDataManagerState({
      activeSortOption: {
        id: 'name-sort',
        label: 'Name',
        propertyName: 'name',
        descending: true,
      },
      searchText: 'initial-search',
      views: [
        {
          viewId: component.viewId,
        },
      ],
    });

    dataManagerService.updateDataState(initialState, 'initial');
    fixture.detectChanges();
    await fixture.whenStable();

    const spy = spyOn(dataManagerService, 'updateDataState').and.callThrough();

    const hostState: SkyDataHost = {
      id: component.viewId,
      displayedColumnIds: ['updated-1', 'updated-2'],
      page: 4,
      selectedIds: [],
      searchText: undefined,
      activeSortOption: { propertyName: 'name', descending: false },
    };

    adapterService.updateDataHost(hostState, 'host-list');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(spy.calls.count()).toBeGreaterThan(0);
    const [updatedState, source] = spy.calls.mostRecent().args;
    expect(source).toBe('skyDataManagerHostController--test-view');
    expect(updatedState.searchText).toBe('initial-search');
    expect(updatedState.activeSortOption?.propertyName).toBe('name');
    expect(updatedState.activeSortOption?.descending).toBeTrue();

    const viewState = updatedState.getViewStateById(component.viewId);
    expect(viewState?.displayedColumnIds).toEqual(['updated-1', 'updated-2']);
    expect(viewState?.additionalData?.page).toBe(4);
  });
});
