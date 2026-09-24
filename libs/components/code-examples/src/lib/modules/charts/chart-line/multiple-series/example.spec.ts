import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartLineHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartLineMultipleSeriesExample } from './example';

describe('Multiple series line chart example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartLineMultipleSeriesExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(
      ChartsChartLineMultipleSeriesExample,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'actual-vs-target' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Actual vs. target',
    );
  });

  it('should render the line chart plot', async () => {
    const { harness } = await setupTest();

    const lineHarness = await harness.queryHarness(SkyChartLineHarness);

    await expectAsync(lineHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should expose both series through the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Year');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo([
      'Actual',
      'Target',
    ]);

    await dataTable.close();
  });
});
