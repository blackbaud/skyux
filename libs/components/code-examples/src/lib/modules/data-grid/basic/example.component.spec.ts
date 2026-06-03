import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';
import { SkyInlineDeleteHarness } from '@skyux/layout/testing';
import {
  SkyDropdownHarness,
  SkyDropdownMenuHarness,
} from '@skyux/popovers/testing';

import { DataGridBasicExampleComponent } from './example.component';

describe('Basic data grid example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridBasicExampleComponent>;
    loader: HarnessLoader;
    docLoader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridBasicExampleComponent],
      providers: [provideNoopSkyAnimations()],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataGridBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const docLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    fixture.detectChanges();

    return { fixture, loader, docLoader };
  }

  it('should create the component and show data', async () => {
    const { fixture, loader } = await setupTest();
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({
        dataSkyId: 'example-data-grid',
      }),
    );
    await expectAsync(gridHarness.getDisplayedColumnIds()).toBeResolvedTo([
      'ag-Grid-SelectionColumn',
      'context',
      'name',
      'age',
      'startDate',
      'endDate',
      'department',
      'jobTitle',
    ]);
    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo([
      '',
      'Context menu',
      'Name',
      'Age',
      'Start date',
      'End date',
      'Department',
      'Title',
    ]);
  });

  it('should show context menu and handle item click', async () => {
    const { fixture, loader, docLoader } = await setupTest();
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
    const menuHarness = await docLoader.getHarness(SkyDropdownMenuHarness);

    const moreInfoButton = await menuHarness.querySelector(
      'button[aria-label="More info for Jane Deere"]',
    );
    expect(moreInfoButton).toBeTruthy();
    const moreInfoActionSpy = spyOn(window, 'alert').and.stub();
    await moreInfoButton?.click();
    expect(moreInfoActionSpy).toHaveBeenCalledWith(
      'More info clicked for Jane Deere',
    );

    await expectAsync(
      docLoader.countHarnesses(SkyInlineDeleteHarness),
    ).toBeResolvedTo(0);
    const deleteButton = await menuHarness.querySelector(
      'button[aria-label="Delete Jane Deere"]',
    );
    expect(deleteButton).toBeTruthy();
    await deleteButton?.click();
    await expectAsync(
      docLoader.countHarnesses(SkyInlineDeleteHarness),
    ).toBeResolvedTo(1);
    let rowDelete = await docLoader.getHarness(SkyInlineDeleteHarness);
    await rowDelete.clickCancelButton();
    await expectAsync(
      docLoader.countHarnesses(SkyInlineDeleteHarness),
    ).toBeResolvedTo(0);
    await deleteButton?.click();
    rowDelete = await docLoader.getHarness(SkyInlineDeleteHarness);
    await rowDelete.clickDeleteButton();
    await expectAsync(
      docLoader.countHarnesses(SkyInlineDeleteHarness),
    ).toBeResolvedTo(0);
  });
});
