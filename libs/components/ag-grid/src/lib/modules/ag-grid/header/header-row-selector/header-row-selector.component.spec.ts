import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { SkyCheckboxHarness } from '@skyux/forms/testing';

import {
  GridApi,
  IRowNode,
  RowDataUpdatedEvent,
  SelectionChangedEvent,
} from 'ag-grid-community';

import { SkyAgGridHeaderRowSelectorComponent } from './header-row-selector.component';

describe('SkyAgGridHeaderRowSelectorComponent', () => {
  let component: SkyAgGridHeaderRowSelectorComponent;
  let fixture: ComponentFixture<SkyAgGridHeaderRowSelectorComponent>;
  let api: jasmine.SpyObj<
    Pick<
      GridApi,
      | 'addEventListener'
      | 'deselectAll'
      | 'getGridOption'
      | 'getSelectedNodes'
      | 'removeEventListener'
      | 'selectAll'
    >
  >;

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyAgGridHeaderRowSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    api = jasmine.createSpyObj('GridApi', [
      'addEventListener',
      'deselectAll',
      'getGridOption',
      'getSelectedNodes',
      'removeEventListener',
      'selectAll',
    ]);
  });

  it('should show checkbox and select all / deselect all', async () => {
    expect(component).toBeTruthy();
    api.getGridOption.and.returnValue({ mode: 'multiRow' });
    component.agInit({
      api,
      displayName: 'test-selected',
      eGridCell: fixture.nativeElement,
    } as any);
    fixture.detectChanges();
    await fixture.whenStable();

    // Capture the event handler.
    expect(api.addEventListener).toHaveBeenCalledTimes(2);
    const selectEventHandler = api.addEventListener.calls.first().args[1];

    // Check initial state.
    const checkbox = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyCheckboxHarness.with({
        dataSkyId: 'header-row-selector',
      }),
    );
    expect(await checkbox.getLabelHidden()).toBeTrue();
    expect(await checkbox.getLabelText()).toEqual('test-selected');
    expect(await checkbox.isChecked()).toBeFalse();

    // Checking the box calls selectAll.
    await checkbox.check();
    expect(api.selectAll).toHaveBeenCalledTimes(1);

    // Call the event handler.
    selectEventHandler({
      api: api as unknown as GridApi,
      serverSideState: {},
      type: 'selectionChanged',
      source: 'apiSelectAll',
      selectedNodes: Array.from(Array(10).keys()).map(
        (i) => ({ id: `id-${i + 1}` }) as IRowNode,
      ),
      context: {},
    } as SelectionChangedEvent);
    // Wait for async handler.
    await new Promise((resolve) => setTimeout(resolve, 1));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await checkbox.isChecked()).toBeTrue();

    // Unchecking the box calls deselectAll.
    await checkbox.uncheck();
    expect(api.deselectAll).toHaveBeenCalledTimes(1);

    // Call the event handler.
    selectEventHandler({
      api: api as unknown as GridApi,
      serverSideState: {},
      type: 'selectionChanged',
      source: 'apiSelectAll',
      selectedNodes: Array.from(Array(10).keys()).map(
        (i) => ({ id: `id-${i + 1}` }) as IRowNode,
      ),
      context: {},
    } as SelectionChangedEvent);
    // Wait for async handler.
    await new Promise((resolve) => setTimeout(resolve, 1));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await checkbox.isChecked()).toBeFalse();
    expect(api.selectAll).toHaveBeenCalledTimes(1);
    expect(api.deselectAll).toHaveBeenCalledTimes(1);
  });

  it('should show checkbox as indeterminate', async () => {
    expect(component).toBeTruthy();
    api.getGridOption.and.returnValue({ mode: 'multiRow' });
    component.agInit({
      api,
      displayName: 'test-selected',
      eGridCell: fixture.nativeElement,
    } as any);
    fixture.detectChanges();
    await fixture.whenStable();

    // Capture the event handler.
    expect(api.addEventListener).toHaveBeenCalledTimes(2);
    const selectEventHandler = api.addEventListener.calls.first().args[1];

    // Call the event handler.
    selectEventHandler({
      api: api as unknown as GridApi,
      serverSideState: {},
      type: 'selectionChanged',
      source: 'checkboxSelected',
      selectedNodes: Array.from(Array(10).keys()).map(
        (i) => ({ id: `id-${i + 1}` }) as IRowNode,
      ),
      context: {},
    } as SelectionChangedEvent);
    // Wait for async handler.
    await new Promise((resolve) => setTimeout(resolve, 1));
    fixture.detectChanges();
    await fixture.whenStable();

    const checkbox = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyCheckboxHarness.with({
        dataSkyId: 'header-row-selector',
      }),
    );
    expect(await checkbox.isChecked()).toBeFalse();
    const htmlCheckbox = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(htmlCheckbox).toBeTruthy();
    expect(htmlCheckbox?.indeterminate).toBeTrue();
  });

  it('should show checkbox as indeterminate when the data changes', async () => {
    expect(component).toBeTruthy();
    api.getGridOption.and.returnValue({ mode: 'multiRow' });
    component.agInit({
      api,
      displayName: 'test-selected',
      eGridCell: fixture.nativeElement,
    } as any);
    fixture.detectChanges();
    await fixture.whenStable();

    // Capture the event handler.
    expect(api.addEventListener).toHaveBeenCalledTimes(2);
    const dataEventHandler = api.addEventListener.calls.all()[1].args[1];
    api.getSelectedNodes.and.returnValue(
      Array.from(Array(10).keys()).map(
        (i) => ({ id: `id-${i + 1}` }) as IRowNode,
      ),
    );

    // Call the event handler.
    dataEventHandler({
      api: api as unknown as GridApi,
      type: 'rowDataUpdated',
      context: {},
    } as RowDataUpdatedEvent);
    fixture.detectChanges();
    await fixture.whenStable();

    const checkbox = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyCheckboxHarness.with({
        dataSkyId: 'header-row-selector',
      }),
    );
    expect(await checkbox.isChecked()).toBeFalse();
    const htmlCheckbox = (
      fixture.nativeElement as HTMLElement
    ).querySelector<HTMLInputElement>('input[type="checkbox"]');
    expect(htmlCheckbox).toBeTruthy();
    expect(htmlCheckbox?.indeterminate).toBeTrue();
  });

  it('should hide checkbox for single select', async () => {
    expect(component).toBeTruthy();
    api.getGridOption.and.returnValue({ mode: 'singleRow' });
    component.agInit({
      api,
      displayName: 'test-selected',
      eGridCell: fixture.nativeElement,
    } as any);
    fixture.detectChanges();
    await fixture.whenStable();
    const label = (fixture.nativeElement as HTMLElement).getAttribute('title');
    expect(label).toEqual('test-selected');
    expect(component.refresh()).toBeFalse();
  });
});
