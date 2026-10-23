import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyLiveAnnouncerService,
  SkyLogService,
  SkyUIConfigService,
} from '@skyux/core';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';
import { SkyTextHighlightDirective } from '@skyux/indicators';
import { SkyBackToTopMessageType } from '@skyux/layout';
import { SkyFilterState, SkyFilterStateService } from '@skyux/lists';
import { SkySortHarness } from '@skyux/lists/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { firstValueFrom, map, throwError } from 'rxjs';

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
    dataManagerFixture.componentRef.setInput('dock', dock);
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

    it('self-provides SkyDataManagerService when labelText is set', async () => {
      @Component({
        selector: 'sky-data-manager-no-provider-fixture',
        template: `<sky-data-manager labelText="fruit" />`,
        imports: [SkyDataManagerModule],
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

    it('destroys the service it self-provides when the data manager is destroyed', async () => {
      @Component({
        selector: 'sky-data-manager-no-provider-destroy-fixture',
        template: `<sky-data-manager labelText="fruit" />`,
        imports: [SkyDataManagerModule],
      })
      class NoProviderDestroyFixtureComponent {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [NoProviderDestroyFixtureComponent],
      }).compileComponents();

      const fixture = TestBed.createComponent(
        NoProviderDestroyFixtureComponent,
      );
      fixture.detectChanges();

      const completeSpy = jasmine.createSpy('complete');
      fixture.debugElement
        .query(By.directive(SkyDataManagerComponent))
        .injector.get(SkyDataManagerService)
        .getDataManagerConfigUpdates()
        .subscribe({ complete: completeSpy });

      fixture.destroy();

      expect(completeSpy).toHaveBeenCalled();
    });

    it('passes SkyLogService to the service it self-provides', async () => {
      @Component({
        selector: 'sky-data-manager-no-provider-logger-fixture',
        template: `<sky-data-manager labelText="fruit" />`,
        imports: [SkyDataManagerModule],
      })
      class NoProviderLoggerFixtureComponent {}

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [NoProviderLoggerFixtureComponent],
      }).compileComponents();

      const warnSpy = spyOn(TestBed.inject(SkyLogService), 'warn');
      const fixture = TestBed.createComponent(NoProviderLoggerFixtureComponent);
      fixture.detectChanges();

      const service = fixture.debugElement
        .query(By.directive(SkyDataManagerComponent))
        .injector.get(SkyDataManagerService);

      service
        .getDataStateUpdates('test', {
          comparator: () => {
            throw new Error('comparator failed');
          },
        })
        .subscribe();
      service.updateDataState(new SkyDataManagerState({}), 'test-a');
      service.updateDataState(new SkyDataManagerState({}), 'test-b');

      expect(warnSpy).toHaveBeenCalled();
    });

    it('self-provides SkyDataManagerService when labelText is set and an ancestor provides another instance', async () => {
      @Component({
        selector: 'sky-data-manager-nested-fixture',
        template: `
          <sky-data-manager>
            <sky-data-manager class="inner" [labelText]="labelText">
              <sky-data-view viewId="inner-view">
                <p class="inner-content">Inner</p>
              </sky-data-view>
            </sky-data-manager>
          </sky-data-manager>
        `,
        imports: [SkyDataManagerModule],
        providers: [SkyDataManagerService],
      })
      class NestedFixtureComponent {
        public labelText = 'fruit';
      }

      TestBed.resetTestingModule();
      await TestBed.configureTestingModule({
        imports: [NestedFixtureComponent],
      }).compileComponents();

      const fixture = TestBed.createComponent(NestedFixtureComponent);
      const outerService = fixture.debugElement.injector.get(
        SkyDataManagerService,
      );
      outerService.initDataManager({
        activeViewId: 'outer-view',
        dataManagerConfig: {},
        defaultDataState: new SkyDataManagerState({}),
      });
      fixture.detectChanges();
      await fixture.whenStable();

      const innerService = fixture.debugElement
        .query(By.css('.inner'))
        .injector.get(SkyDataManagerService);

      expect(innerService).not.toBe(outerService);
      expect(innerService.getCurrentDataManagerConfig().listDescriptor).toBe(
        'fruit',
      );
      expect(innerService.getViewById('inner-view')).toBeDefined();
      expect(outerService.getViewById('inner-view')).toBeUndefined();
    });
  });
});

@Component({
  selector: 'sky-data-manager-template-api-fixture',
  template: `
    <sky-data-manager
      [labelText]="labelText"
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
          labelText="Name (A - Z)"
          propertyName="name"
        />
        <sky-data-manager-sort-option
          id="za"
          labelText="Name (Z - A)"
          propertyName="name"
          [descending]="true"
        />
      </sky-data-manager-toolbar>
      <div skyDataManagerFilterController></div>
      <sky-data-view
        viewId="view1"
        [multiselectEnabled]="multiselectEnabled"
        [searchEnabled]="searchEnabled"
        [searchPlaceholderText]="searchPlaceholderText"
        (clearAll)="selectedIds = []"
        (selectAll)="selectedIds = ['1', '2']"
      >
        <p class="template-api-content">Content</p>
      </sky-data-view>
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
      expect(fixture.componentInstance.states.length).toBeGreaterThan(0);
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
      ).toExist();
      expect(
        fixture.nativeElement.querySelector('.sky-data-manager-clear-all-btn'),
      ).toExist();

      const view = getService().getViewById('view1');
      expect(view?.multiselectToolbarEnabled).toBeTrue();
      view?.onSelectAllClick?.();
      fixture.detectChanges();
      expect(getService().state().selectedIds).toEqual(['1', '2']);
      view?.onClearAllClick?.();
      fixture.detectChanges();
      expect(getService().state().selectedIds).toEqual([]);
      expect(getService().getCurrentDataManagerConfig().listDescriptor).toBe(
        'fruit',
      );
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should update the data manager and view configs when the inputs change', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      expect(
        fixture.nativeElement.querySelector('.sky-data-manager-search'),
      ).not.toExist();

      fixture.componentInstance.labelText = 'vegetables';
      fixture.componentInstance.searchEnabled = true;
      fixture.componentInstance.searchPlaceholderText = 'Search vegetables';
      fixture.componentInstance.multiselectEnabled = true;
      fixture.detectChanges();
      await fixture.whenStable();

      const views = await firstValueFrom(getService().getDataViewsUpdates());

      expect(getService().getCurrentDataManagerConfig().listDescriptor).toBe(
        'vegetables',
      );
      expect(views).toEqual([
        jasmine.objectContaining({
          multiselectToolbarEnabled: true,
          searchEnabled: true,
          searchPlaceholderText: 'Search vegetables',
        }),
      ]);
      expect(
        fixture.nativeElement.querySelector('.sky-data-manager-search'),
      ).toExist();
      expect(
        fixture.nativeElement.querySelector(
          '.sky-data-manager-multiselect-toolbar',
        ),
      ).toExist();
    });

    it('should preserve controller-supplied config when view inputs change', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      getService().updateViewConfig({
        ...getService().getViewById('view1'),
        id: 'view1',
        name: 'View 1',
        columnOptions: [{ id: 'name', label: 'Name' }],
        additionalOptions: { custom: true },
      });
      fixture.componentInstance.searchEnabled = true;
      fixture.detectChanges();
      await fixture.whenStable();

      expect(getService().getViewById('view1')?.columnOptions).toEqual([
        { id: 'name', label: 'Name' },
      ]);
      expect(getService().getViewById('view1')?.additionalOptions).toEqual({
        custom: true,
      });
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

        fixture.componentInstance.searchText = 'plum';
        fixture.detectChanges();

        expect(console.warn).toHaveBeenCalledWith(
          'Could not save data manager settings.',
        );
      });
    });
  });

  describe('when labelText is not set and the consumer provides the service', () => {
    @Component({
      selector: 'sky-data-manager-consumer-configured-fixture',
      template: `
        <sky-data-manager
          [(searchText)]="searchText"
          [(selectedIds)]="selectedIds"
          (stateChange)="states.push($event)"
        >
          <sky-data-view viewId="view1" [searchEnabled]="searchEnabled">
            <p class="template-api-content">Content</p>
          </sky-data-view>
        </sky-data-manager>
      `,
      imports: [SkyDataManagerModule],
    })
    class ConsumerConfiguredFixtureComponent {
      public searchEnabled = false;
      public searchText = '';
      public selectedIds: string[] = [];
      public states: SkyDataManagerState[] = [];
    }

    let consumerFixture: ComponentFixture<ConsumerConfiguredFixtureComponent>;
    let service: SkyDataManagerService;

    function getConsumerContent(): HTMLElement | null {
      return consumerFixture.nativeElement.querySelector(
        '.template-api-content',
      );
    }

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [ConsumerConfiguredFixtureComponent],
        providers: [SkyDataManagerService],
      });

      service = TestBed.inject(SkyDataManagerService);
      consumerFixture = TestBed.createComponent(
        ConsumerConfiguredFixtureComponent,
      );
    });

    it('should use the consumer-provided service', () => {
      consumerFixture.detectChanges();

      expect(
        consumerFixture.debugElement
          .query(By.directive(SkyDataManagerComponent))
          .injector.get(SkyDataManagerService),
      ).toBe(service);
    });

    it('should wait for initDataManager() instead of seeding the state', () => {
      consumerFixture.componentInstance.searchText = 'ignored';
      consumerFixture.detectChanges();

      expect(getConsumerContent()).not.toExist();
      expect(consumerFixture.componentInstance.states).toEqual([]);

      service.initDataManager({
        activeViewId: 'view1',
        dataManagerConfig: {},
        defaultDataState: new SkyDataManagerState({ searchText: 'apple' }),
      });
      consumerFixture.detectChanges();

      expect(getConsumerContent()).toExist();
      expect(consumerFixture.componentInstance.searchText).toBe('apple');
      expect(consumerFixture.componentInstance.states.at(-1)?.searchText).toBe(
        'apple',
      );
    });

    it('should push model changes after initDataManager()', () => {
      consumerFixture.detectChanges();
      service.initDataManager({
        activeViewId: 'view1',
        dataManagerConfig: {},
        defaultDataState: new SkyDataManagerState({}),
      });
      consumerFixture.detectChanges();

      consumerFixture.componentInstance.searchText = 'kiwi';
      consumerFixture.componentInstance.selectedIds = ['3'];
      consumerFixture.detectChanges();

      expect(service.state().searchText).toBe('kiwi');
      expect(service.state().selectedIds).toEqual(['3']);
    });

    it('should not apply the view inputs to the view config', () => {
      consumerFixture.detectChanges();
      service.initDataManager({
        activeViewId: 'view1',
        dataManagerConfig: {},
        defaultDataState: new SkyDataManagerState({}),
      });
      service.initDataView({ id: 'view1', name: 'View 1' });
      consumerFixture.detectChanges();

      consumerFixture.componentInstance.searchEnabled = true;
      consumerFixture.detectChanges();

      expect(service.getViewById('view1')?.searchEnabled).toBeUndefined();
    });
  });
});

@Component({
  selector: 'sky-data-manager-template-api-views-fixture',
  template: `
    <sky-data-manager labelText="fruit">
      <p class="viewless-content">Viewless</p>
      @if (showViews) {
        <sky-data-view viewId="first">
          <p class="first-view-content">First</p>
        </sky-data-view>
        <sky-data-view viewId="second">
          <p class="second-view-content">Second</p>
        </sky-data-view>
      }
    </sky-data-manager>
  `,
  imports: [SkyDataManagerModule],
})
class TemplateApiViewsFixtureComponent {
  public showViews = true;
}

describe('SkyDataManagerComponent template API views', () => {
  let fixture: ComponentFixture<TemplateApiViewsFixtureComponent>;

  function getService(): SkyDataManagerService {
    return fixture.debugElement
      .query(By.directive(SkyDataManagerComponent))
      .injector.get(SkyDataManagerService);
  }

  function getViewIds(): Promise<string[]> {
    return firstValueFrom(
      getService()
        .getDataViewsUpdates()
        .pipe(map((views) => views.map((view) => view.id))),
    );
  }

  function getActiveViewId(): Promise<string> {
    return firstValueFrom(getService().getActiveViewIdUpdates());
  }

  function getViewContent(view: 'first' | 'second'): HTMLElement | null {
    return fixture.nativeElement.querySelector(`.${view}-view-content`);
  }

  describe('when the data manager provides its own service', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TemplateApiViewsFixtureComponent],
      });

      fixture = TestBed.createComponent(TemplateApiViewsFixtureComponent);
    });

    it('should register each data view and make the first one active', async () => {
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(getViewIds()).toBeResolvedTo(['first', 'second']);
      await expectAsync(getActiveViewId()).toBeResolvedTo('first');
      expect(getViewContent('first')).toExist();
      expect(getViewContent('second')).not.toExist();
      expect(getService().state().getViewStateById('first')).toBeDefined();
    });

    it('should render without an active view when it contains no data view', async () => {
      fixture.componentInstance.showViews = false;
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(getViewIds()).toBeResolvedTo([]);
      await expectAsync(getActiveViewId()).toBeResolvedTo('');
      expect(
        fixture.nativeElement.querySelector('.viewless-content'),
      ).toExist();
    });

    it('should make the first data view created later active', async () => {
      fixture.componentInstance.showViews = false;
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.showViews = true;
      fixture.detectChanges();
      await fixture.whenStable();

      await expectAsync(getViewIds()).toBeResolvedTo(['first', 'second']);
      await expectAsync(getActiveViewId()).toBeResolvedTo('first');
      expect(getViewContent('first')).toExist();
    });
  });

  describe('when an ancestor provides the service', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TemplateApiViewsFixtureComponent],
        providers: [SkyDataManagerService],
      });

      fixture = TestBed.createComponent(TemplateApiViewsFixtureComponent);
    });

    it('should register data views with its own service', async () => {
      const ancestorService = TestBed.inject(SkyDataManagerService);
      const initDataViewSpy = spyOn(
        ancestorService,
        'initDataView',
      ).and.callThrough();

      fixture.detectChanges();
      await fixture.whenStable();

      expect(getService()).not.toBe(ancestorService);
      expect(initDataViewSpy).not.toHaveBeenCalled();
      await expectAsync(getViewIds()).toBeResolvedTo(['first', 'second']);
    });
  });
});
