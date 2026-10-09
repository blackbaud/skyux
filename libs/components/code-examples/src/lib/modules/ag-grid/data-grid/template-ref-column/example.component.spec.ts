import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  SkyAgGridWrapperHarness,
  provideSkyAgGridTesting,
} from '@skyux/ag-grid/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { AgGridDataGridTemplateRefColumnExampleComponent } from './example.component';

describe('AG Grid data grid template ref column example', () => {
  async function setupTest(): Promise<{
    gridHarness: SkyAgGridWrapperHarness;
    gridElement: HTMLElement;
  }> {
    await TestBed.configureTestingModule({
      imports: [AgGridDataGridTemplateRefColumnExampleComponent],
      providers: [provideSkyAgGridTesting(), provideNoopSkyAnimations()],
    }).compileComponents();

    const fixture = TestBed.createComponent(
      AgGridDataGridTemplateRefColumnExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    const gridHarness = await loader.getHarness(
      SkyAgGridWrapperHarness.with({ dataSkyId: 'template-ref-column-grid' }),
    );
    // AG Grid renders outside the Angular zone, so wait on the harness rather than `whenStable()`.
    await gridHarness.waitUntilRendered();
    fixture.detectChanges();

    return { gridHarness, gridElement: fixture.nativeElement as HTMLElement };
  }

  it('should render the grid with the expected columns', async () => {
    const { gridHarness } = await setupTest();

    await expectAsync(
      gridHarness.getDisplayedColumnHeaderNames(),
    ).toBeResolvedTo(['Name', 'Age', 'Department', 'Title']);
  });

  it('should render cells using the template ref columns', async () => {
    const { gridElement } = await setupTest();
    // The templates' markup has no harness, so query the first row's cells directly.
    const departmentCell = gridElement.querySelector(
      '.ag-row[row-index="0"] [col-id="department"]',
    );
    const jobTitleCell = gridElement.querySelector(
      '.ag-row[row-index="0"] [col-id="jobTitle"]',
    );

    expect(departmentCell?.querySelector('strong')?.textContent?.trim()).toBe(
      'Customer Support',
    );
    expect(jobTitleCell?.querySelector('em')?.textContent?.trim()).toBe(
      'Customer Support Representative',
    );
    expect(
      jobTitleCell?.querySelector('.sky-pull-right')?.textContent?.trim(),
    ).toBe('🥈');
  });
});
