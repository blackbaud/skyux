import {
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  expect
} from '@skyux-sdk/testing';

import {
  DataManagerFixtureComponent
} from './fixtures/data-manager.component.fixture';

import {
  DataManagerFixtureModule
} from './fixtures/data-manager.module.fixture';

import {
  DataViewCardFixtureComponent
} from './fixtures/data-manager-card-view.component.fixture';

import {
  DataViewRepeaterFixtureComponent
} from './fixtures/data-manager-repeater-view.component.fixture';

import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState
} from '../../public_api';

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
        DataViewRepeaterFixtureComponent
      ],
      imports: [
        DataManagerFixtureModule,
        SkyDataManagerModule
      ]
    });

    dataManagerFixture = TestBed.createComponent(DataManagerFixtureComponent);
    dataManagerNativeElement = dataManagerFixture.nativeElement;
    dataManagerFixtureComponent = dataManagerFixture.componentInstance;
    dataManagerService = TestBed.inject(SkyDataManagerService);
  });

  it('should render a toolbar and view if the data manager state has been set', () => {
    dataManagerService.updateDataState(new SkyDataManagerState({}), 'test');
    dataManagerFixture.detectChanges();

    const toolbarEl = dataManagerNativeElement.querySelector('sky-data-manager-toolbar');
    const viewEl = dataManagerNativeElement.querySelector('sky-data-view');

    expect(dataManagerFixtureComponent.dataManagerComponent.isInitialized).toBeTrue();
    expect(toolbarEl).toBeVisible();
    expect(viewEl).toBeVisible();
  });

  it('should update the viewkeeper classes when the subscription provides a new value', () => {
    const newClass = 'newClass';
    const viewId = 'repeaterView';

    dataManagerFixture.detectChanges();

    dataManagerService.updateActiveViewId(viewId);

    dataManagerFixture.detectChanges();

    expect(dataManagerFixtureComponent.dataManagerComponent.currentViewkeeperClasses
      .indexOf('.sky-data-manager-toolbar') >= 0).toBeTrue();
    expect(dataManagerFixtureComponent.dataManagerComponent.currentViewkeeperClasses.indexOf(newClass) >= 0).toBeFalse();

    dataManagerService.setViewkeeperClasses(viewId, [newClass]);

    expect(dataManagerFixtureComponent.dataManagerComponent.currentViewkeeperClasses.indexOf(newClass) >= 0).toBeTrue();
  });

  it('should pass accessibility', async(() => {
    dataManagerFixture.detectChanges();

    dataManagerFixture.whenStable().then(() => {
      expect(dataManagerNativeElement).toBeAccessible();
    });
  }));
});
