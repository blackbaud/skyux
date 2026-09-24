import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartLineHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartLineBasicExample } from './example';

describe('Basic line chart example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartLineBasicExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartLineBasicExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'acquisitions-by-year' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Acquisitions by year',
    );
  });

  it('should render the line chart plot', async () => {
    const { harness } = await setupTest();

    const lineHarness = await harness.queryHarness(
      SkyChartLineHarness.with({ dataSkyId: 'acquisitions-line' }),
    );

    await expectAsync(lineHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should expose the chart data through the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Year');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo([
      'Acquisitions by year',
    ]);
    await expectAsync(
      dataTable.getCategories().then((categories) => categories.length),
    ).toBeResolvedTo(7);

    await dataTable.close();
  });
});
