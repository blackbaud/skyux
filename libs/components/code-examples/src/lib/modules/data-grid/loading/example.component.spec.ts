import { HarnessLoader, manualChangeDetection } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDataGridHarness } from '@skyux/data-grid/testing';

import { DataGridLoadingExampleComponent } from './example.component';

describe('Data grid loading example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<DataGridLoadingExampleComponent>;
    loader: HarnessLoader;
    gridHarness: SkyDataGridHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [DataGridLoadingExampleComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(DataGridLoadingExampleComponent);
    fixture.componentRef.setInput('delay', 0);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    const gridHarness = await loader.getHarness(
      SkyDataGridHarness.with({ dataSkyId: 'example-data-grid' }),
    );

    return { fixture, loader, gridHarness };
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

  it('should create the component and show the first page of data', async () => {
    const { fixture, gridHarness } = await setupTest();
    expect(fixture.componentInstance).toBeDefined();
    await expectAsync(gridHarness.isGridReady()).toBeResolvedTo(true);

    const wait = await gridHarness.getWait();
    await expectAsync(wait.isWaiting()).toBeResolvedTo(false);
    // The server returns one page (pageSize = 5) at a time.
    expect(await gridHarness.getDisplayedRowCount()).toBe(5);
  });

  it('should page through the server-side data', async () => {
    const { fixture, gridHarness } = await setupTest();
    const paging = await gridHarness.getPaging();
    await expectAsync(paging.getCurrentPage()).toBeResolvedTo(1);

    await paging.clickNextButton();
    await fixture.whenStable();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();

    await expectAsync(paging.getCurrentPage()).toBeResolvedTo(2);
    expect(await gridHarness.getDisplayedRowCount()).toBe(5);
  });

  it('should clear rows and hide paging for the empty state', async () => {
    const { fixture, gridHarness } = await setupTest();
    await clickButton(fixture, 'show-empty-button');
    expect(await gridHarness.getDisplayedRowCount()).toBe(0);
    await expectAsync(gridHarness.getPagingOrNull()).toBeResolvedTo(null);
  });

  it('should show the loading overlay for the loading state', async () => {
    const { fixture, gridHarness } = await setupTest();

    // The loading state uses a resource that never resolves, so the app never
    // reaches zone stability. Drive change detection manually (rather than
    // through `clickButton`, which awaits `whenStable`) and query the harness
    // under `manualChangeDetection` so the CDK does not auto-stabilize, which
    // would otherwise hang until the test times out.
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>('[data-sky-id="show-loading-button"]')
      ?.click();
    fixture.detectChanges();
    await Promise.resolve();
    fixture.detectChanges();

    await manualChangeDetection(async () => {
      await expectAsync(gridHarness.isLoading()).toBeResolvedTo(true);
    });
  });

  it('should restore rows when data is shown again', async () => {
    const { fixture, gridHarness } = await setupTest();
    await clickButton(fixture, 'show-empty-button');
    expect(await gridHarness.getDisplayedRowCount()).toBe(0);

    await clickButton(fixture, 'show-data-button');
    expect(await gridHarness.getDisplayedRowCount()).toBe(5);
  });
});
