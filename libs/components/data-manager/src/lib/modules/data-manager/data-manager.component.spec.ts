import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyBackToTopMessageType } from '@skyux/layout';

import { SkyDataManagerService } from './data-manager.service';
import { DataViewCardFixtureComponent } from './fixtures/data-manager-card-view.component.fixture';
import { DataViewRepeaterFixtureComponent } from './fixtures/data-manager-repeater-view.component.fixture';
import { DataManagerFixtureComponent } from './fixtures/data-manager.component.fixture';
import { DataManagerFixtureModule } from './fixtures/data-manager.module.fixture';
import { SkyDataManagerState } from './models/data-manager-state';
import { SkyDataViewConfig } from './models/data-view-config';

describe('SkyDataManagerComponent', () => {
  let dataManagerFixture: ComponentFixture<DataManagerFixtureComponent>;
  let dataManagerFixtureComponent: DataManagerFixtureComponent;
  let dataManagerNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataManagerFixtureComponent,
        DataViewCardFixtureComponent,
        DataViewRepeaterFixtureComponent,
      ],
      imports: [DataManagerFixtureModule],
    });

    dataManagerFixture = TestBed.createComponent(DataManagerFixtureComponent);
    dataManagerNativeElement = dataManagerFixture.nativeElement;
    dataManagerFixtureComponent = dataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
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

  it('should highlight matching search text searchHighlightEnabled is true', () => {
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

    const highlightedItem = dataManagerNativeElement.querySelector(
      '.sky-highlight-mark',
    );

    expect(highlightedItem).toExist();
  });

  it('should clear the highlight if searchHighlightEnabled changes to false', () => {
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

    let highlightedItem = dataManagerNativeElement.querySelector(
      '.sky-highlight-mark',
    );

    expect(highlightedItem).toExist();

    newConfig.searchHighlightEnabled = false;
    dataManagerService.updateViewConfig(newConfig);
    dataManagerFixture.detectChanges();

    highlightedItem = dataManagerNativeElement.querySelector(
      '.sky-highlight-mark',
    );
    expect(highlightedItem).not.toExist();
  });

  it('should pass accessibility', async () => {
    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();
    dataManagerFixture.detectChanges();
    await dataManagerFixture.whenStable();
    await expectAsync(dataManagerNativeElement).toBeAccessible();
  });
});
