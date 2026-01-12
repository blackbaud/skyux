import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';
import {
  SkyDropdownHarness,
  SkyDropdownMenuHarness,
} from '@skyux/popovers/testing';

import { DataGridBasicExampleComponent } from './example.component';

describe('Basic data grid example', () => {
  let fixture: ComponentFixture<DataGridBasicExampleComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataGridBasicExampleComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(DataGridBasicExampleComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create the component and show data', async () => {
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({
        dataSkyId: 'example-data-grid',
      }),
    );
    expect(await gridHarness.getDisplayedColumnIds()).toEqual([
      'context',
      'name',
      'age',
      'startDate',
      'endDate',
      'department',
      'jobTitle',
    ]);
    expect(await gridHarness.getDisplayedColumnHeaderNames()).toEqual([
      '',
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
    ]);
  });

  it('should show context menu and handle item click', async () => {
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({
        dataSkyId: 'example-data-grid',
      }),
    );
    const menuButtonHarness = await gridHarness.queryHarness(
      SkyDropdownHarness.with({
        dataSkyId: 'context-menu-2',
      }),
    );
    await menuButtonHarness.clickDropdownButton();
    const menuHarness = await TestbedHarnessEnvironment.documentRootLoader(
      fixture,
    ).getHarness(SkyDropdownMenuHarness);
    const deleteButton = await menuHarness.querySelector(
      'button[aria-label="Delete Jane Deere"]',
    );
    expect(deleteButton).toBeTruthy();
    const actionSpy = spyOn(window, 'alert').and.stub();
    await deleteButton?.click();
    expect(actionSpy).toHaveBeenCalledWith('Delete clicked for Jane Deere');
  });
});
