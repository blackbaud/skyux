import { HarnessLoader, manualChangeDetection } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  provideSkyDataGridTesting,
  SkyDataGridHarness,
} from '@skyux/data-grid/testing';

import { Provider, ResourceLoader } from '@angular/core';
import { DATA_LOADER, DataGridServerPage, DataGridServerParams } from './data';
import { DataGridLoadingExampleComponent } from './example.component';

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
    await TestBed.configureTestingModule({
      imports: [DataGridLoadingExampleComponent],
      providers,
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

  async function settle(fixture: ComponentFixture<unknown>): Promise<void> {
    await fixture.whenStable();
    fixture.detectChanges();
    await new Promise((resolve) => setTimeout(resolve));
    fixture.detectChanges();
  }

  async function clickButton(
    fixture: ComponentFixture<DataGridLoadingExampleComponent>,
    dataSkyId: string,
  ): Promise<void> {
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLButtonElement>(`[data-sky-id="${dataSkyId}"]`)
      ?.click();
    await settle(fixture);
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
    await settle(fixture);

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
    const emptyPage: DataGridServerPage = { items: [], totalCount: 0 };
    // The production loader's "loading" behavior never resolves until
    // aborted, so use a spy that mirrors that: resolve immediately for
    // every behavior except "loading", which hangs forever to keep the
    // grid in a sustained loading state for the assertion below.
    const loader = jasmine
      .createSpy('loader')
      .and.callFake((args: { params: DataGridServerParams }) =>
        args.params.behavior === 'loading'
          ? new Promise<DataGridServerPage>(() => {
              // never resolves: sustained loading
            })
          : Promise.resolve(emptyPage),
      );
    const { fixture, gridHarness } = await setupTest({ dataLoader: loader });

    // Confirm the grid's render-readiness handshake has already completed
    // before introducing a load that never resolves. The data grid also
    // renders its own render-readiness wait through `SkyWaitHarness`
    // (separate from the loading overlay under test below); settling here,
    // while the initial "data" load still resolves immediately, ensures
    // that wait has already cleared before `manualChangeDetection` disables
    // further automatic stabilization.
    await settle(fixture);
    const readyWait = await gridHarness.getWait();
    await expectAsync(readyWait.isWaiting()).toBeResolvedTo(false);

    // The "loading" behavior's resource load never resolves, so it leaves
    // an Angular `PendingTasks` entry open indefinitely. `fixture.whenStable()`
    // - used by `clickButton`/`settle`, and internally by every CDK harness
    // query via `forceStabilize()` - awaits that same pending-task signal,
    // so it would hang forever here. `manualChangeDetection()` suspends the
    // harness environment's automatic stabilization for its duration, so
    // change detection must be driven manually below.
    await manualChangeDetection(async () => {
      (fixture.nativeElement as HTMLElement)
        .querySelector<HTMLButtonElement>('[data-sky-id="show-loading-button"]')
        ?.click();
      fixture.detectChanges();

      // AG Grid mounts its loading overlay component outside the Angular
      // zone, so poll on a bounded, real-time basis (not zone/PendingTasks
      // stability) to give it a chance to appear.
      const deadline = Date.now() + 2000;
      while (!(await gridHarness.isLoading()) && Date.now() < deadline) {
        await new Promise((resolve) => setTimeout(resolve, 25));
        fixture.detectChanges();
      }

      await expectAsync(gridHarness.isLoading()).toBeResolvedTo(true);
    });

    expect(loader).toHaveBeenCalledWith({
      params: jasmine.objectContaining({
        behavior: 'loading',
        delay: 0,
        pageSize: 5,
        page: 1,
      }),
      abortSignal: jasmine.any(AbortSignal),
      previous: { status: 'resolved' },
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
