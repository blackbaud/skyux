import { Component } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';

import { SkyDataManagerComponent } from './data-manager.component';
import { SkyDataManagerModule } from './data-manager.module';
import { SkyDataManagerService } from './data-manager.service';
import { SkyDataViewComponent } from './data-view.component';
import { DataViewRepeaterFixtureComponent } from './fixtures/data-manager-repeater-view.component.fixture';
import { DataManagerFixtureModule } from './fixtures/data-manager.module.fixture';
import { SkyDataManagerColumnPickerSortStrategy } from './models/data-manager-column-picker-sort-strategy';

describe('SkyDataViewComponent', () => {
  let dataViewFixture: ComponentFixture<DataViewRepeaterFixtureComponent>;
  let dataViewComponent: DataViewRepeaterFixtureComponent;
  let dataViewNativeElement: HTMLElement;
  let dataManagerService: SkyDataManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataViewRepeaterFixtureComponent],
      imports: [DataManagerFixtureModule],
      providers: [provideSkyMediaQueryTesting()],
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
      dataViewComponent.viewConfig,
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

  it('should leave a service-owned view config unchanged after rendering', async () => {
    dataViewFixture.detectChanges();
    await dataViewFixture.whenStable();

    expect(dataManagerService.getViewById(dataViewComponent.viewId)).toEqual(
      dataViewComponent.viewConfig,
    );
  });

  it('should not register a view without a view ID', async () => {
    const fixture = TestBed.createComponent(SkyDataViewComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.isActive).toBeFalse();
  });
});

@Component({
  imports: [SkyDataManagerModule],
  template: `
    <sky-data-manager labelText="Items">
      <sky-data-view
        viewId="list"
        viewName="List"
        iconName="list"
        columnPickerEnabled
        searchEnabled
        searchHighlightEnabled
        showSortButtonText
        searchExpandMode="fit"
        columnPickerSortStrategy="selectedThenAlphabetical"
      />
    </sky-data-manager>
  `,
})
class TemplateViewFixtureComponent {}

describe('SkyDataViewComponent template config', () => {
  it('should register view-specific inputs', async () => {
    TestBed.configureTestingModule({
      imports: [TemplateViewFixtureComponent],
    });
    const fixture = TestBed.createComponent(TemplateViewFixtureComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const service = fixture.debugElement
      .query(By.directive(SkyDataManagerComponent))
      .injector.get(SkyDataManagerService);

    expect(service.getViewById('list')).toEqual(
      jasmine.objectContaining({
        id: 'list',
        name: 'List',
        iconName: 'list',
        columnPickerEnabled: true,
        columnPickerSortStrategy:
          SkyDataManagerColumnPickerSortStrategy.SelectedThenAlphabetical,
        searchEnabled: true,
        searchExpandMode: 'fit',
        searchHighlightEnabled: true,
        showSortButtonText: true,
      }),
    );
  });
});
