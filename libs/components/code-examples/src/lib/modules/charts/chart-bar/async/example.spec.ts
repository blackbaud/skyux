import { manualChangeDetection } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartBarHarness, SkyChartHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartBarAsyncExample } from './example';

describe('Async bar chart example', () => {
  // The harness loader waits for the fixture to stabilize, which resolves the
  // example's simulated server call, so the chart is loaded by the time a
  // harness is returned. The delay is set to 0 to keep the test fast.
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartBarAsyncExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartBarAsyncExample);
    fixture.componentRef.setInput('delay', 0);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'donations-by-quarter' }),
    );

    return { fixture, harness };
  }

  it('should render the chart once the data resolves', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Donations by quarter',
    );
    await expectAsync(harness.isLoading()).toBeResolvedTo(false);
  });

  it('should show the loading state until the request resolves', async () => {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartBarAsyncExample);
    fixture.componentRef.setInput('delay', 0);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    // Drive change detection manually so the CDK does not auto-stabilize the
    // fixture, which would resolve the simulated request before the loading
    // state can be observed.
    await manualChangeDetection(async () => {
      fixture.detectChanges();

      const harness = await loader.getHarness(
        SkyChartHarness.with({ dataSkyId: 'donations-by-quarter' }),
      );

      await expectAsync(harness.isLoading()).toBeResolvedTo(true);

      // A pending timer keeps the zone unstable, so `whenStable` waits for the
      // simulated request to resolve without a fixed wall-clock delay.
      await fixture.whenStable();
      fixture.detectChanges();

      await expectAsync(harness.isLoading()).toBeResolvedTo(false);
    });
  });

  it('should render the bar chart plot', async () => {
    const { harness } = await setupTest();

    const barHarness = await harness.queryHarness(SkyChartBarHarness);

    await expectAsync(barHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should expose the loaded data through the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Quarter');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo([
      'Donations',
    ]);
    await expectAsync(dataTable.getCategories()).toBeResolvedTo([
      'Q1',
      'Q2',
      'Q3',
      'Q4',
    ]);
    await expectAsync(dataTable.getValues()).toBeResolvedTo([
      ['$45.00'],
      ['$72.00'],
      ['$38.00'],
      ['$90.00'],
    ]);

    await dataTable.close();
  });
});
