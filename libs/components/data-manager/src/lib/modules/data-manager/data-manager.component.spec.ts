import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';
import { SkyTextHighlightDirective } from '@skyux/indicators';
import { SkyBackToTopMessageType } from '@skyux/layout';

import { SkyDataManagerService } from './data-manager.service';
import { SkyDataViewComponent } from './data-view.component';
import { DataViewCardFixtureComponent } from './fixtures/data-manager-card-view.component.fixture';
import { DataViewRepeaterFixtureComponent } from './fixtures/data-manager-repeater-view.component.fixture';
import { DataManagerFixtureComponent } from './fixtures/data-manager.component.fixture';
import { DataManagerFixtureModule } from './fixtures/data-manager.module.fixture';
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
});
