import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { expect, expectAsync } from '@skyux-sdk/testing';

import { DataManagerFixtureModule } from './fixtures/data-manager.module.fixture';

import { DataViewRepeaterFixtureComponent } from './fixtures/data-manager-repeater-view.component.fixture';

import { SkyDataManagerService } from '../../public-api';

describe('SkyDataViewComponent', () => {
  let dataViewFixture: ComponentFixture<DataViewRepeaterFixtureComponent>;
  let dataViewComponent: DataViewRepeaterFixtureComponent;
  let dataViewNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataViewRepeaterFixtureComponent],
      imports: [DataManagerFixtureModule],
    });

    dataViewFixture = TestBed.createComponent(DataViewRepeaterFixtureComponent);
    dataViewNativeElement = dataViewFixture.nativeElement;
    dataViewComponent = dataViewFixture.componentInstance;
    dataViewComponent.items = [];
    dataManagerService = TestBed.inject(SkyDataManagerService);
  });

  it('should register its config with the data manager service on initialization', fakeAsync(() => {
    spyOn(dataManagerService, 'initDataView');

    dataViewFixture.detectChanges();
    tick();
    dataViewFixture.detectChanges();

    expect(dataManagerService.initDataView).toHaveBeenCalledWith(
      dataViewComponent.viewConfig
    );
  }));

  it("should update its isActive property to true when the data manager service updates the activeViewId to the view's id", () => {
    dataViewComponent.isActive = false;
    dataViewFixture.detectChanges();

    expect(dataViewComponent.isActive).toBe(false);

    dataManagerService.updateActiveViewId(dataViewComponent.viewId);

    expect(dataViewComponent.isActive).toBe(true);
  });

  it(`should update its isActive property to false when the data manager service updates the
   activeViewId to a different view's id`, () => {
    dataViewComponent.isActive = true;
    dataViewFixture.detectChanges();

    expect(dataViewComponent.isActive).toBe(true);

    dataManagerService.updateActiveViewId('randomId');

    expect(dataViewComponent.isActive).toBe(false);
  });

  it('should pass accessibility', async () => {
    await expectAsync(dataViewNativeElement).toBeAccessible();
  });
});
