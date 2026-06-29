import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';

import { DataGridSortingExampleComponent } from './example.component';

describe('Data grid sorting example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridSortingExampleComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridSortingExampleComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataGridSortingExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    return { fixture, loader };
  }

  function getSortText(
    fixture: ComponentFixture<DataGridSortingExampleComponent>,
  ): string {
    return (
      (fixture.nativeElement as HTMLElement).querySelector(
        '[data-sky-id="current-sort"]',
      )?.textContent ?? ''
    );
  }

  it('should create the component and show the initial sort', async () => {
    const { fixture, loader } = await setupTest();
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'example-data-grid' }),
    );
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);
    expect(getSortText(fixture)).toContain('name (ascending)');
  });

  it('should update the bound sort when the button is clicked', async () => {
    const { fixture } = await setupTest();
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('[data-sky-id="sort-by-age-button"]')
      ?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(getSortText(fixture)).toContain('age (descending)');
  });

  it('should update the bound sort when a column header is clicked', async () => {
    const { fixture, loader } = await setupTest();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'example-data-grid' }),
    );
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);

    // SKY grids default to a `[null, 'desc', 'asc']` sort order, so the first
    // click on an unsorted column sorts it descending.
    await gridHarness.clickColumnSortButton('age');
    await fixture.whenStable();
    fixture.detectChanges();
    expect(getSortText(fixture)).toContain('age (descending)');
  });

  it('should clear the bound sort when the clear button is clicked', async () => {
    const { fixture } = await setupTest();
    expect(getSortText(fixture)).toContain('name (ascending)');

    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('[data-sky-id="clear-sort-button"]')
      ?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(getSortText(fixture)).toContain('no sort applied');
  });
});
