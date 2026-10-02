import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService, SkyUIConfigService } from '@skyux/core';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';
import { SkyTextHighlightDirective } from '@skyux/indicators';
import { SkyBackToTopMessageType } from '@skyux/layout';
import { SkyFilterState, SkyFilterStateService } from '@skyux/lists';
import { SkySortHarness } from '@skyux/lists/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { throwError } from 'rxjs';

import { SkyDataManagerComponent } from './data-manager.component';
import { SkyDataManagerModule } from './data-manager.module';
import { SkyDataManagerService } from './data-manager.service';
import { SkyDataViewComponent } from './data-view.component';
import { DataViewCardFixtureComponent } from './fixtures/data-manager-card-view.component.fixture';
import { DataViewRepeaterFixtureComponent } from './fixtures/data-manager-repeater-view.component.fixture';
import { DataManagerFixtureComponent } from './fixtures/data-manager.component.fixture';
import { DataManagerFixtureModule } from './fixtures/data-manager.module.fixture';
import { SkyDataManagerSortOption } from './models/data-manager-sort-option';
import { SkyDataManagerState } from './models/data-manager-state';
import { SkyDataViewConfig } from './models/data-view-config';
import { SkyDataManagerDockType } from './types/data-manager-dock-type';

describe('SkyDataManagerComponent', () => {
  let dataManagerFixture: ComponentFixture<DataManagerFixtureComponent>;
  let dataManagerFixtureComponent: DataManagerFixtureComponent;
  let dataManagerNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;
  let liveAnnouncerService: SkyLiveAnnouncerService;
  const mockSkyHighlightDirective = jasmine.createSpyObj(
    'SkyTextHighlightDirective',
    ['skyHighlight'],
  );

  async function validateDockCssClass(
    dock: SkyDataManagerDockType | undefined,
    expectedCssClass: string,
  ): Promise<void> {
    dataManagerFixture.componentInstance.dock = dock;
    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();

    expect(document.querySelector('.sky-data-manager')?.classList).toContain(
      expectedCssClass,
    );
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataManagerFixtureComponent,
        DataViewCardFixtureComponent,
        DataViewRepeaterFixtureComponent,
      ],
      imports: [DataManagerFixtureModule],
      providers: [provideSkyMediaQueryTesting()],
    });

    dataManagerFixture = TestBed.overrideComponent(SkyDataViewComponent, {
      set: {
        providers: [
          {
            provide: SkyTextHighlightDirective,
            useValue: mockSkyHighlightDirective,
          },
        ],
      },
    }).createComponent(DataManagerFixtureComponent);
    dataManagerNativeElement = dataManagerFixture.nativeElement;
    dataManagerFixtureComponent = dataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
    liveAnnouncerService = TestBed.inject(SkyLiveAnnouncerService);
  });

  it('should render a toolbar and view if the data manager state has been set', () => {
    dataManagerService.updateDataState(new SkyDataManagerState({}), 'test');
    dataManagerFixture.detectChanges();

    const toolbarEl = dataManagerNativeElement.querySelector(
      'sky-data-manager-toolbar',
    );
    const viewEl = dataManagerNativeElement.querySelector('sky-data-view');

    expect(
      dataManagerFixtureComponent.dataManagerComponent.isInitialized,
    ).toBeTrue();
    expect(toolbarEl).toBeVisible();
    expect(viewEl).toBeVisible();
  });

  it('should update the viewkeeper classes when the subscription provides a new value', () => {
    const newClass = 'newClass';
    const viewId = 'repeaterView';

    dataManagerFixture.detectChanges();

    dataManagerService.updateActiveViewId(viewId);

    dataManagerFixture.detectChanges();

    expect(
      dataManagerFixtureComponent.dataManagerComponent.currentViewkeeperClasses.indexOf(
        '.sky-data-manager-toolbar',
      ) >= 0,
    ).toBeTrue();
    expect(
      dataManagerFixtureComponent.dataManagerComponent.currentViewkeeperClasses.indexOf(
        newClass,
      ) >= 0,
    ).toBeFalse();

    dataManagerService.setViewkeeperClasses(viewId, [newClass]);

    expect(
      dataManagerFixtureComponent.dataManagerComponent.currentViewkeeperClasses.indexOf(
        newClass,
      ) >= 0,
    ).toBeTrue();
  });

  it('should send a message to the back to top component to scroll to top when the active view changes', () => {
    dataManagerFixture.detectChanges();

    const backToTopController =
      dataManagerFixture.componentInstance.dataManagerComponent
        .backToTopController;
    spyOn(backToTopController, 'next');

    dataManagerService.updateActiveViewId('newView');

    expect(backToTopController.next).toHaveBeenCalledWith({
      type: SkyBackToTopMessageType.BackToTop,
    });
  });

  it('should highlight matching search text searchHighlightEnabled is true', async () => {
    dataManagerFixture.detectChanges();

    const repeaterViewConfig = dataManagerService.getViewById('repeaterView');
    const newConfig = {
      ...repeaterViewConfig,
      searchHighlightEnabled: true,
    } as SkyDataViewConfig;

    dataManagerService.updateViewConfig(newConfig);
    dataManagerService.updateDataState(
      new SkyDataManagerState({
        searchText: dataManagerFixtureComponent.items[0].name,
      }),
      'unitTest',
    );

    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();

    expect(mockSkyHighlightDirective.skyHighlight).toBe(
      dataManagerFixtureComponent.items[0].name,
    );
  });

  it('should clear the highlight if searchHighlightEnabled changes to false', async () => {
    dataManagerFixture.detectChanges();

    const repeaterViewConfig = dataManagerService.getViewById('repeaterView');
    const newConfig = {
      ...repeaterViewConfig,
      searchHighlightEnabled: true,
    } as SkyDataViewConfig;
    const state = new SkyDataManagerState({
      searchText: dataManagerFixtureComponent.items[0].name,
    });

    dataManagerService.updateViewConfig(newConfig);
    dataManagerService.updateDataState(state, 'unitTest');
    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();

    expect(mockSkyHighlightDirective.skyHighlight).toBe(
      dataManagerFixtureComponent.items[0].name,
    );

    newConfig.searchHighlightEnabled = false;
    dataManagerService.updateViewConfig(newConfig);
    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();

    expect(mockSkyHighlightDirective.skyHighlight).toBeUndefined();
  });

  it('should announce a status message when the data summary changes, all items are displayed, and some are selected', async () => {
    const liveAnnouncerSpy = spyOn(liveAnnouncerService, 'announce');
    dataManagerFixture.detectChanges();

    dataManagerService.updateDataState(
      new SkyDataManagerState({
        selectedIds: ['1', '2'],
      }),
      'unitTest',
    );
    dataManagerService.updateDataSummary(
      { totalItems: 10, itemsMatching: 8 },
      'unitTest',
    );

    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();

    expect(liveAnnouncerSpy).toHaveBeenCalledWith(
      '8 of 10 items meet criteria and 2 selected.',
    );
  });

  it('should announce a status message when the data summary changes, all items are displayed, and none are selected', async () => {
    const liveAnnouncerSpy = spyOn(liveAnnouncerService, 'announce');
    dataManagerFixture.detectChanges();

    dataManagerService.updateDataSummary(
      { totalItems: 10, itemsMatching: 8 },
      'unitTest',
    );

    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();

    expect(liveAnnouncerSpy).toHaveBeenCalledWith(
      '8 of 10 items meet criteria.',
    );
  });

  it('should announce a status message when the data summary changes and only selected items are displayed', async () => {
    const liveAnnouncerSpy = spyOn(liveAnnouncerService, 'announce');
    dataManagerFixture.detectChanges();

    dataManagerService.updateDataState(
      new SkyDataManagerState({
        onlyShowSelected: true,
        selectedIds: ['1', '2'],
      }),
      'unitTest',
    );

    dataManagerService.updateDataSummary(
      { totalItems: 10, itemsMatching: 2 },
      'unitTest',
    );

    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();

    expect(liveAnnouncerSpy).toHaveBeenCalledWith(
      '2 of 10 items meet criteria and 2 selected. Only selected items are displayed.',
    );
  });

  it('should pass accessibility', async () => {
    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();
    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();
    await expectAsync(dataManagerNativeElement).toBeAccessible();
  });

  it('should apply the correct CSS class for the dock input', async () => {
    await validateDockCssClass('none', 'sky-data-manager-dock-none');
    await validateDockCssClass('fill', 'sky-data-manager-dock-fill');
    await validateDockCssClass(undefined, 'sky-data-manager-dock-none');
  });

  describe('self-providing SkyDataManagerService', () => {
    it('reuses an ancestor-provided SkyDataManagerService instance instead of creating its own', () => {
      // The existing fixture module provides `SkyDataManagerService` itself, so the
      // component must reuse that exact instance, not create a second one.
      const ancestorInstance = TestBed.inject(SkyDataManagerService);
      const fixture = TestBed.createComponent(DataManagerFixtureComponent);
      fixture.detectChanges();

      expect(fixture.componentInstance.dataManagerComponent).toBeTruthy();
      const componentInjectedInstance = fixture.debugElement
        .query(By.directive(SkyDataManagerComponent))
        .injector.get(SkyDataManagerService);

      expect(componentInjectedInstance).toBe(ancestorInstance);
    });

    it('self-provides SkyDataManagerService when no ancestor provides it', async () => {
      @Component({
        selector: 'sky-data-manager-no-provider-fixture',
        template: `<sky-data-manager />`,
        imports: [SkyDataManagerComponent],
      })
      class NoProviderFixtureComponent {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [NoProviderFixtureComponent],
      }).compileComponents();

      const fixture = TestBed.createComponent(NoProviderFixtureComponent);
      fixture.detectChanges();

      const injectedInstance = fixture.debugElement
        .query(By.directive(SkyDataManagerComponent))
        .injector.get(SkyDataManagerService);

      expect(injectedInstance).toBeInstanceOf(SkyDataManagerService);
      expect(TestBed.inject(SkyDataManagerService, null)).toBeNull();
    });
  });
});

@Component({
  selector: 'sky-data-manager-template-api-fixture',
  template: `
    <sky-data-manager
      [labelText]="labelText"
      [multiselectEnabled]="multiselectEnabled"
      [searchEnabled]="searchEnabled"
      [searchPlaceholderText]="searchPlaceholderText"
      [settingsKey]="settingsKey"
      [totalCount]="totalCount"
      [(filters)]="filters"
      [(searchText)]="searchText"
      [(selectedIds)]="selectedIds"
      [(sort)]="sort"
      (stateChange)="states.push($event)"
    >
      <sky-data-manager-toolbar>
        <sky-data-manager-sort-option
          id="az"
          label="Name (A - Z)"
          propertyName="name"
        />
        <sky-data-manager-sort-option
          id="za"
          label="Name (Z - A)"
          propertyName="name"
          [descending]="true"
        />
      </sky-data-manager-toolbar>
      <div skyDataManagerFilterController></div>
      <p class="template-api-content">Content</p>
    </sky-data-manager>
  `,
  imports: [SkyDataManagerModule],
})
class TemplateApiFixtureComponent {
  public filters: SkyFilterState | undefined;
  public labelText: string | undefined;
  public multiselectEnabled = false;
  public searchEnabled = false;
  public searchPlaceholderText: string | undefined;
  public searchText = '';
  public selectedIds: string[] = [];
  public settingsKey: string | undefined;
  public sort: SkyDataManagerSortOption | undefined;
  public states: SkyDataManagerState[] = [];
  public totalCount = 0;
}

describe('SkyDataManagerComponent template API', () => {
  let fixture: ComponentFixture<TemplateApiFixtureComponent>;

  const sortOption: SkyDataManagerSortOption = {
    id: 'az',
    propertyName: 'name',
    label: 'Name (A - Z)',
    descending: false,
  };

  function getService(): SkyDataManagerService {
    return fixture.debugElement
      .query(By.directive(SkyDataManagerComponent))
      .injector.get(SkyDataManagerService);
  }

  function getContent(): HTMLElement | null {
    return fixture.nativeElement.querySelector('.template-api-content');
  }

  function lastState(): SkyDataManagerState | undefined {
    return fixture.componentInstance.states.at(-1);
  }

  describe('when the data manager provides its own service', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TemplateApiFixtureComponent],
      });

      fixture = TestBed.createComponent(TemplateApiFixtureComponent);
    });

    it('should render and emit the initial state when nothing is bound', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getContent()).toExist();
      expect(fixture.componentInstance.states.length).toBe(1);
      expect(lastState()?.searchText).toBe('');
      expect(lastState()?.selectedIds).toEqual([]);
    });

    it('should seed the state from the models', () => {
      fixture.componentInstance.searchText = 'mango';
      fixture.componentInstance.selectedIds = ['1'];
      fixture.componentInstance.sort = sortOption;
      fixture.detectChanges();

      expect(getService().state().searchText).toBe('mango');
      expect(getService().state().selectedIds).toEqual(['1']);
      expect(getService().state().activeSortOption).toEqual(sortOption);
      expect(lastState()?.searchText).toBe('mango');
    });

    it('should push model changes into the state and emit them', () => {
      fixture.detectChanges();

      fixture.componentInstance.searchText = 'lime';
      fixture.componentInstance.selectedIds = ['1', '2'];
      fixture.componentInstance.sort = sortOption;
      fixture.detectChanges();
      fixture.detectChanges();

      expect(getService().state().searchText).toBe('lime');
      expect(getService().state().selectedIds).toEqual(['1', '2']);
      expect(getService().state().activeSortOption).toEqual(sortOption);
      expect(lastState()?.searchText).toBe('lime');
      expect(lastState()?.activeSortOption).toEqual(sortOption);
    });

    it('should reflect state changes from other sources into the models', () => {
      fixture.detectChanges();

      getService().updateState({ searchText: 'banana', selectedIds: ['9'] });
      fixture.detectChanges();

      expect(fixture.componentInstance.searchText).toBe('banana');
      expect(fixture.componentInstance.selectedIds).toEqual(['9']);
      expect(lastState()?.searchText).toBe('banana');
    });

    it('should apply a search from the toolbar', async () => {
      fixture.componentInstance.searchEnabled = true;
      fixture.componentInstance.searchPlaceholderText = 'Search fruit';
      fixture.detectChanges();
      await fixture.whenStable();

      const search =
        await TestbedHarnessEnvironment.loader(fixture).getHarness(
          SkySearchHarness,
        );

      await expectAsync(search.getPlaceholderText()).toBeResolvedTo(
        'Search fruit',
      );

      await search.enterText('pear');
      await search.clickSubmitButton();
      fixture.detectChanges();

      expect(fixture.componentInstance.searchText).toBe('pear');
      expect(lastState()?.searchText).toBe('pear');
    });

    it('should apply a sort option from the toolbar', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const sort =
        await TestbedHarnessEnvironment.loader(fixture).getHarness(
          SkySortHarness,
        );

      await sort.click();
      await (await sort.getItem({ text: 'Name (A - Z)' })).click();
      fixture.detectChanges();

      expect(fixture.componentInstance.sort).toEqual(sortOption);
      expect(lastState()?.activeSortOption).toEqual(sortOption);
    });

    it('should apply each sort option selected from the toolbar in turn', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      const sort =
        await TestbedHarnessEnvironment.loader(fixture).getHarness(
          SkySortHarness,
        );

      for (const [label, id] of [
        ['Name (Z - A)', 'za'],
        ['Name (A - Z)', 'az'],
        ['Name (Z - A)', 'za'],
      ]) {
        await sort.click();
        await (await sort.getItem({ text: label })).click();
        fixture.detectChanges();
        await fixture.whenStable();

        expect(fixture.componentInstance.sort?.id).toBe(id);
        expect(getService().state().activeSortOption?.id).toBe(id);
      }
    });

    it('should configure the toolbar label and multiselect toolbar', async () => {
      fixture.componentInstance.labelText = 'fruit';
      fixture.componentInstance.multiselectEnabled = true;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        fixture.nativeElement.querySelector(
          '.sky-data-manager-multiselect-toolbar',
        ),
      ).toExist();
      expect(
        fixture.nativeElement.querySelector('.sky-data-manager-select-all-btn'),
      ).toBeNull();
      expect(
        fixture.nativeElement.querySelector('.sky-data-manager-clear-all-btn'),
      ).toBeNull();
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should announce the data summary when totalCount changes', async () => {
      const announceSpy = spyOn(
        TestBed.inject(SkyLiveAnnouncerService),
        'announce',
      );
      fixture.detectChanges();

      fixture.componentInstance.totalCount = 5;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(announceSpy).toHaveBeenCalled();
    });

    it('should seed filterData from the filters model', () => {
      fixture.componentInstance.filters = {
        appliedFilters: [{ filterId: 'a', filterValue: { value: 'x' } }],
      };
      fixture.detectChanges();

      expect(getService().state().filterData?.filtersApplied).toBeTrue();
    });

    it('should not mark filters as applied when none are applied', () => {
      fixture.componentInstance.filters = { appliedFilters: [] };
      fixture.detectChanges();

      expect(getService().state().filterData?.filtersApplied).toBeFalse();
    });

    it('should push filters model changes, including clearing them', () => {
      fixture.detectChanges();

      fixture.componentInstance.filters = { selectedFilterIds: ['a'] };
      fixture.detectChanges();

      expect(getService().state().filterData).toEqual({
        filtersApplied: false,
        filters: { selectedFilterIds: ['a'] },
      });

      fixture.componentInstance.filters = undefined;
      fixture.detectChanges();

      expect(getService().state().filterData).toBeUndefined();
    });

    it('should keep filtersApplied set by another source when the filters model echoes it', () => {
      fixture.detectChanges();

      getService().updateState({
        filterData: { filtersApplied: true, filters: { legacy: true } },
      });
      fixture.detectChanges();
      fixture.detectChanges();

      expect(fixture.componentInstance.filters).toEqual({
        legacy: true,
      } as SkyFilterState);
      expect(getService().state().filterData?.filtersApplied).toBeTrue();
    });

    it('should sync filters from a filter bar using the filter controller', () => {
      fixture.detectChanges();

      fixture.debugElement
        .query(By.css('[skyDataManagerFilterController]'))
        .injector.get(SkyFilterStateService)
        .updateFilterState(
          { appliedFilters: [{ filterId: 'a', filterValue: { value: 'x' } }] },
          'test-filter-bar',
        );
      fixture.detectChanges();

      expect(fixture.componentInstance.filters?.appliedFilters).toEqual([
        { filterId: 'a', filterValue: { value: 'x' } },
      ]);
    });

    describe('with a settingsKey', () => {
      let uiConfigService: SkyUIConfigService;

      beforeEach(() => {
        uiConfigService = TestBed.inject(SkyUIConfigService);
        fixture.componentInstance.settingsKey = 'fruit-settings';
      });

      it('should restore the state from SkyUIConfigService', () => {
        spyOn(uiConfigService, 'getConfig').and.callThrough();
        fixture.detectChanges();

        expect(uiConfigService.getConfig).toHaveBeenCalledWith(
          'fruit-settings',
          jasmine.objectContaining({ searchText: '', selectedIds: [] }),
        );
        expect(getContent()).toExist();
      });

      it('should persist state changes, including changes from the toolbar', async () => {
        const setConfigSpy = spyOn(
          uiConfigService,
          'setConfig',
        ).and.callThrough();
        fixture.detectChanges();
        await fixture.whenStable();
        setConfigSpy.calls.reset();

        const sort =
          await TestbedHarnessEnvironment.loader(fixture).getHarness(
            SkySortHarness,
          );
        await sort.click();
        await (await sort.getItem({ text: 'Name (A - Z)' })).click();

        expect(setConfigSpy).toHaveBeenCalledWith(
          'fruit-settings',
          jasmine.objectContaining({ activeSortOption: sortOption }),
        );
      });

      it('should log a warning when settings cannot be saved', () => {
        spyOn(uiConfigService, 'setConfig').and.returnValue(
          throwError(() => new Error('save failed')),
        );
        spyOn(console, 'warn');
        fixture.detectChanges();

        expect(console.warn).toHaveBeenCalledWith(
          'Could not save data manager settings.',
        );
      });
    });
  });

  describe('when an ancestor provides the service', () => {
    let service: SkyDataManagerService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TemplateApiFixtureComponent],
        providers: [SkyDataManagerService],
      });

      service = TestBed.inject(SkyDataManagerService);
      fixture = TestBed.createComponent(TemplateApiFixtureComponent);
    });

    it('should wait for initDataManager() instead of seeding the state', () => {
      fixture.componentInstance.searchText = 'ignored';
      fixture.detectChanges();

      expect(getContent()).not.toExist();
      expect(fixture.componentInstance.states).toEqual([]);

      service.initDataManager({
        activeViewId: 'view1',
        dataManagerConfig: {},
        defaultDataState: new SkyDataManagerState({ searchText: 'apple' }),
      });
      fixture.detectChanges();

      expect(getContent()).toExist();
      expect(fixture.componentInstance.searchText).toBe('apple');
      expect(lastState()?.searchText).toBe('apple');
    });

    it('should push model changes after initDataManager()', () => {
      fixture.detectChanges();
      service.initDataManager({
        activeViewId: 'view1',
        dataManagerConfig: {},
        defaultDataState: new SkyDataManagerState({}),
      });
      fixture.detectChanges();

      fixture.componentInstance.searchText = 'kiwi';
      fixture.componentInstance.selectedIds = ['3'];
      fixture.detectChanges();

      expect(service.state().searchText).toBe('kiwi');
      expect(service.state().selectedIds).toEqual(['3']);
    });
  });
});
