import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyChartBarHarness, SkyChartHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartBarValueFormatExample } from './example';

describe('Value format bar chart example', () => {
  function setupTest(): { loader: HarnessLoader } {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartBarValueFormatExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    return { loader };
  }

  it('should render every value format as a separate chart', async () => {
    const { loader } = setupTest();

    const numberChart = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'acquisitions-by-month' }),
    );
    const currency = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'revenue-by-month' }),
    );
    const percent = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'conversion-rate-by-month' }),
    );

    await expectAsync(numberChart.getHeadingText()).toBeResolvedTo(
      'Acquisitions by month',
    );
    await expectAsync(currency.getHeadingText()).toBeResolvedTo(
      'Revenue by month',
    );
    await expectAsync(percent.getHeadingText()).toBeResolvedTo(
      'Conversion rate by month',
    );
  });

  it('should render each chart plot', async () => {
    const { loader } = setupTest();

    const charts = await loader.getAllHarnesses(SkyChartHarness);

    expect(charts.length).toBe(3);

    for (const chart of charts) {
      const barHarness = await chart.queryHarness(SkyChartBarHarness);

      await expectAsync(barHarness.isChartRendered()).toBeResolvedTo(true);
    }
  });

  it('should format the currency values in the data table modal', async () => {
    const { loader } = setupTest();

    const currency = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'revenue-by-month' }),
    );

    const dataTable = await currency.openDataTableModal();

    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo(['Revenue']);
    await expectAsync(
      dataTable.getValues().then((rows) => rows[0][0]),
    ).toBeResolvedTo('€1,000');

    await dataTable.close();
  });
});
