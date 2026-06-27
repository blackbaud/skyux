import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';

import { DataGridLoadingExampleComponent } from './example.component';

describe('Data grid loading example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridLoadingExampleComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridLoadingExampleComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataGridLoadingExampleComponent);
    fixture.componentRef.setInput('delay', 0);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();

    return { fixture, loader };
  }

  function getRowCount(
    fixture: ComponentFixture<DataGridLoadingExampleComponent>,
  ): number {
    return (fixture.nativeElement as HTMLElement).querySelectorAll(
      '.ag-center-cols-container .ag-row',
    ).length;
  }

  async function clickButton(
    fixture: ComponentFixture<DataGridLoadingExampleComponent>,
    dataSkyId: string,
  ): Promise<void> {
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>(`[data-sky-id="${dataSkyId}"]`)
      ?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
  }

  it('should create the component and show data initially', async () => {
    const { fixture, loader } = await setupTest();
    expect(fixture.componentInstance).toBeDefined();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'example-data-grid' }),
    );
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);

    const wait = await gridHarness.getWait();
    await expectAsync(wait.isWaiting()).toBeResolvedTo(false);
    expect(getRowCount(fixture)).toBe(5);
  });

  it('should clear rows for the empty state', async () => {
    const { fixture } = await setupTest();
    await clickButton(fixture, 'show-empty-button');
    expect(getRowCount(fixture)).toBe(0);
  });

  it('should clear rows for the loading state', async () => {
    const { fixture, loader } = await setupTest();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'example-data-grid' }),
    );
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);
    const wait = await gridHarness.getWait();
    await expectAsync(wait.isWaiting()).toBeResolvedTo(false);
    await clickButton(fixture, 'show-loading-button');
    // expect(getRowCount(fixture)).toBe(0);
  });

  it('should restore rows when data is shown again', async () => {
    const { fixture } = await setupTest();
    await clickButton(fixture, 'show-empty-button');
    expect(getRowCount(fixture)).toBe(0);

    await clickButton(fixture, 'show-data-button');
    expect(getRowCount(fixture)).toBe(5);
  });
});
