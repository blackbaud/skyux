import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideSkyDataGridTesting,
  SkyDataGridHarness,
} from '@skyux/data-grid/testing';

import { DataGridLoadingExampleComponent } from './example.component';
import { Provider, ResourceLoader } from '@angular/core';
import { DATA_LOADER, DataGridServerPage, DataGridServerParams } from './data';

describe('Data grid loading example', () => {
  async function setupTest(options?: {
    dataLoader?: ResourceLoader<DataGridServerPage, DataGridServerParams>;
  }): Promise<{
    fixture: ComponentFixture<DataGridLoadingExampleComponent>;
    loader: HarnessLoader;
    gridHarness: SkyDataGridHarness;
  }> {
    const providers: Provider[] = [provideSkyDataGridTesting()];
    if (options?.dataLoader) {
      providers.push({
        provide: DATA_LOADER,
        useValue: options.dataLoader,
      });
    }
    await TestBed.configureTestingModule({ imports: [DataGridLoadingExampleComponent], providers})
      .compileComponents();
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
    const loader = jasmine.createSpy('loader').and.returnValue(Promise.resolve({
      items: [],
      totalCount: 0,
    }));
    const { fixture } = await setupTest({ dataLoader: loader });
    // The loading state uses a resource that never resolves, so the app never
    // reaches zone stability. Instead, use a test spy as a mock loader.
    await clickButton(fixture, 'show-loading-button');
    expect(loader).toHaveBeenCalledWith({params: jasmine.objectContaining({
      behavior: 'loading',
      delay: 0,
      pageSize: 5,
      page: 1,
    }), abortSignal: jasmine.any(AbortSignal), previous: { status: 'resolved' }});
  });

  it('should restore rows when data is shown again', async () => {
    const { fixture, gridHarness } = await setupTest();
    await clickButton(fixture, 'show-empty-button');
    expect(await gridHarness.getDisplayedRowCount()).toBe(0);

    await clickButton(fixture, 'show-data-button');
    expect(await gridHarness.getDisplayedRowCount()).toBe(5);
  });
});
