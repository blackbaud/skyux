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
          label: 'Name (A-Z)',
          propertyName: 'name',
          descending: false,
        },
        {
          id: 'name-sort-za',
          label: 'Name (Z-A)',
          propertyName: 'name',
          descending: true,
        },
      ],
    });

    const initialState = new SkyDataManagerState({
      activeSortOption: {
        id: 'name-sort-za',
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
    expect(updatedState.searchText).toBeUndefined();
    expect(updatedState.activeSortOption?.propertyName).toBe('name');
    expect(updatedState.activeSortOption?.descending).toBeFalse();

    const viewState = updatedState.getViewStateById(component.viewId);
    expect(viewState?.displayedColumnIds).toEqual(['updated-1', 'updated-2']);
    expect(viewState?.additionalData?.page).toBe(4);
  });

  describe('distinct changes for data host updates', () => {
    it('should not update adapter when data manager state has no changes', async () => {
      const initialState = new SkyDataManagerState({
        searchText: 'search-text',
        selectedIds: ['1', '2'],
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1'],
            additionalData: {
              page: 1,
            },
          },
        ],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      // Wait for the initial sync to the adapter to complete
      // The directive will have updated the adapter once with initial values
      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      // Update with identical state values
      const identicalState = new SkyDataManagerState({
        searchText: 'search-text',
        selectedIds: ['1', '2'],
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1'],
            additionalData: {
              page: 1,
            },
          },
        ],
      });

      dataManagerService.updateDataState(identicalState, 'duplicate-update');
      fixture.detectChanges();
      await fixture.whenStable();

      // The directive should not update the adapter since the computed host state is identical
      expect(spy).not.toHaveBeenCalled();
    });

    it('should update adapter when searchText changes', async () => {
      const initialState = new SkyDataManagerState({
        searchText: 'initial-search',
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        searchText: 'updated-search',
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(updatedState, 'search-update');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.searchText).toBe('updated-search');
    });

    it('should update adapter when page changes', async () => {
      const initialState = new SkyDataManagerState({
        views: [
          {
            viewId: component.viewId,
            additionalData: { page: 1 },
          },
        ],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        views: [
          {
            viewId: component.viewId,
            additionalData: { page: 2 },
          },
        ],
      });

      dataManagerService.updateDataState(updatedState, 'page-update');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.page).toBe(2);
    });

    it('should update adapter when displayedColumnIds changes', async () => {
      const initialState = new SkyDataManagerState({
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1', 'col-2'],
          },
        ],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1', 'col-3'],
          },
        ],
      });

      dataManagerService.updateDataState(updatedState, 'columns-update');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.displayedColumnIds).toEqual(['col-1', 'col-3']);
    });

    it('should update adapter when displayedColumnIds length changes', async () => {
      const initialState = new SkyDataManagerState({
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1', 'col-2'],
          },
        ],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1'],
          },
        ],
      });

      dataManagerService.updateDataState(updatedState, 'columns-length-update');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.displayedColumnIds).toEqual(['col-1']);
    });

    it('should update adapter when selectedIds changes', async () => {
      const initialState = new SkyDataManagerState({
        selectedIds: ['1', '2'],
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        selectedIds: ['1', '3'],
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(updatedState, 'selected-update');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.selectedIds).toEqual(['1', '3']);
    });

    it('should update adapter when selectedIds length changes', async () => {
      const initialState = new SkyDataManagerState({
        selectedIds: ['1', '2'],
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        selectedIds: ['1'],
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(
        updatedState,
        'selected-length-update',
      );
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.selectedIds).toEqual(['1']);
    });

    it('should update adapter when activeSortOption propertyName changes', async () => {
      const initialState = new SkyDataManagerState({
        activeSortOption: {
          id: '1',
          label: 'Name',
          propertyName: 'name',
          descending: false,
        },
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        activeSortOption: {
          id: '2',
          label: 'Date',
          propertyName: 'date',
          descending: false,
        },
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(updatedState, 'sort-property-update');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.activeSortOption?.propertyName).toBe('date');
    });

    it('should update adapter when activeSortOption descending changes', async () => {
      const initialState = new SkyDataManagerState({
        activeSortOption: {
          id: '1',
          label: 'Name',
          propertyName: 'name',
          descending: false,
        },
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();

      const spy = spyOn(adapterService, 'updateDataHost').and.callThrough();

      const updatedState = new SkyDataManagerState({
        activeSortOption: {
          id: '1',
          label: 'Name',
          propertyName: 'name',
          descending: true,
        },
        views: [{ viewId: component.viewId }],
      });

      dataManagerService.updateDataState(
        updatedState,
        'sort-descending-update',
      );
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [hostState] = spy.calls.mostRecent().args;
      expect(hostState.activeSortOption?.descending).toBeTrue();
    });
  });

  describe('distinct changes for data manager state updates', () => {
    async function setupInitialState(): Promise<void> {
      dataManagerService.updateDataManagerConfig({
        sortOptions: [
          {
            id: 'name-sort',
            label: 'Name',
            propertyName: 'name',
            descending: false,
          },
          {
            id: 'name-sort',
            label: 'Name',
            propertyName: 'name',
            descending: true,
          },
          {
            id: 'date-sort',
            label: 'Date',
            propertyName: 'date',
            descending: false,
          },
          {
            id: 'date-sort',
            label: 'Date',
            propertyName: 'date',
            descending: true,
          },
        ],
      });

      const initialState = new SkyDataManagerState({
        activeSortOption: {
          id: 'name-sort',
          label: 'Name',
          propertyName: 'name',
          descending: false,
        },
        searchText: 'initial-search',
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1', 'col-2'],
            additionalData: { page: 1 },
          },
        ],
      });

      dataManagerService.updateDataState(initialState, 'initial');
      fixture.detectChanges();
      await fixture.whenStable();
    }

    it('should not echo data manager state changes back to data manager', async () => {
      await setupInitialState();

      const spy = spyOn(
        dataManagerService,
        'updateDataState',
      ).and.callThrough();

      // When data manager state changes, the directive converts it and sends to adapter.
      // Verify that this converted state doesn't echo back to data manager.
      const updatedState = new SkyDataManagerState({
        activeSortOption: {
          id: 'name-sort',
          label: 'Name',
          propertyName: 'name',
          descending: false,
        },
        searchText: 'initial-search',
        views: [
          {
            viewId: component.viewId,
            displayedColumnIds: ['col-1', 'col-2'],
            additionalData: { page: 2 },
          },
        ],
      });

      dataManagerService.updateDataState(updatedState, 'external-source');
      fixture.detectChanges();
      await fixture.whenStable();

      // The directive should have updated the adapter, but that adapter update
      // should not cause an echo back to data manager since the values are equivalent
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(jasmine.anything(), 'external-source');
    });

    it('should not echo adapter state changes back to adapter', async () => {
      await setupInitialState();

      const adapterSpy = spyOn(
        adapterService,
        'updateDataHost',
      ).and.callThrough();

      // Update adapter with new displayedColumnIds
      const updatedHostState: SkyDataHost = {
        id: component.viewId,
        displayedColumnIds: ['col-1', 'col-3'],
        page: 1,
        searchText: 'initial-search',
        activeSortOption: { propertyName: 'name', descending: false },
        selectedIds: undefined,
      };

      adapterService.updateDataHost(updatedHostState, 'external-source');
      fixture.detectChanges();
      await fixture.whenStable();

      // The adapter was called once directly, but the update to data manager
      // should not cause the directive to echo back to adapter
      expect(adapterSpy).toHaveBeenCalledTimes(1);
      expect(adapterSpy).toHaveBeenCalledWith(
        updatedHostState,
        'external-source',
      );
    });

    it('should update data manager when displayedColumnIds changes from adapter', async () => {
      await setupInitialState();

      const spy = spyOn(
        dataManagerService,
        'updateDataState',
      ).and.callThrough();

      const updatedHostState: SkyDataHost = {
        id: component.viewId,
        displayedColumnIds: ['col-1', 'col-3'],
        page: 1,
        searchText: 'initial-search',
        activeSortOption: { propertyName: 'name', descending: false },
        selectedIds: ['1', '2', '3'],
      };

      adapterService.updateDataHost(updatedHostState, 'external-source');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [updatedState] = spy.calls.mostRecent().args;
      expect(updatedState?.selectedIds).toEqual(['1', '2', '3']);
      const viewState = updatedState.getViewStateById(component.viewId);
      expect(viewState?.displayedColumnIds).toEqual(['col-1', 'col-3']);

      const updatedHostState2: SkyDataHost = {
        id: component.viewId,
        displayedColumnIds: ['col-1', 'col-3'],
        page: 1,
        searchText: 'initial-search',
        activeSortOption: { propertyName: 'name', descending: false },
        selectedIds: ['3', '4', '5'],
      };

      adapterService.updateDataHost(updatedHostState2, 'external-source');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [updatedState2] = spy.calls.mostRecent().args;
      expect(updatedState2?.selectedIds).toEqual(['3', '4', '5']);
    });

    it('should update data manager when page changes from adapter', async () => {
      await setupInitialState();

      const spy = spyOn(
        dataManagerService,
        'updateDataState',
      ).and.callThrough();

      const updatedHostState: SkyDataHost = {
        id: component.viewId,
        displayedColumnIds: ['col-1', 'col-2'],
        page: 5,
        searchText: 'initial-search',
        activeSortOption: { propertyName: 'name', descending: false },
        selectedIds: undefined,
      };

      adapterService.updateDataHost(updatedHostState, 'external-source');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [updatedState] = spy.calls.mostRecent().args;
      const viewState = updatedState.getViewStateById(component.viewId);
      expect(viewState?.additionalData?.page).toBe(5);
    });

    it('should update data manager when activeSortOption propertyName changes from adapter', async () => {
      await setupInitialState();

      const spy = spyOn(
        dataManagerService,
        'updateDataState',
      ).and.callThrough();

      const updatedHostState: SkyDataHost = {
        id: component.viewId,
        displayedColumnIds: ['col-1', 'col-2'],
        page: 1,
        searchText: 'initial-search',
        activeSortOption: { propertyName: 'date', descending: false },
        selectedIds: undefined,
      };

      adapterService.updateDataHost(updatedHostState, 'external-source');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [updatedState] = spy.calls.mostRecent().args;
      expect(updatedState.activeSortOption?.propertyName).toBe('date');
    });

    it('should update data manager when displayedColumnIds length changes from adapter', async () => {
      await setupInitialState();

      const spy = spyOn(
        dataManagerService,
        'updateDataState',
      ).and.callThrough();

      const updatedHostState: SkyDataHost = {
        id: component.viewId,
        displayedColumnIds: ['col-1'],
        page: 1,
        searchText: 'initial-search',
        activeSortOption: { propertyName: 'name', descending: false },
        selectedIds: undefined,
      };

      adapterService.updateDataHost(updatedHostState, 'external-source');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(spy).toHaveBeenCalled();
      const [updatedState] = spy.calls.mostRecent().args;
      const viewState = updatedState.getViewStateById(component.viewId);
      expect(viewState?.displayedColumnIds).toEqual(['col-1']);
    });
  });
});
