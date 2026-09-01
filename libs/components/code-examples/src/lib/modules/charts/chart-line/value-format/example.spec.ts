import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartLineHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartLineValueFormatExample } from './example';

describe('Value format line chart example', () => {
  function setupTest(): { loader: HarnessLoader } {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartLineValueFormatExample);
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
      const lineHarness = await chart.queryHarness(SkyChartLineHarness);

      await expectAsync(lineHarness.isChartRendered()).toBeResolvedTo(true);
    }
  });

  it('should format each axis format in the data table modal', async () => {
    const { loader } = setupTest();

    const numberChart = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'acquisitions-by-month' }),
    );

    const numberTable = await numberChart.openDataTableModal();

    await expectAsync(numberTable.getSeriesLabels()).toBeResolvedTo([
      'Acquisitions',
    ]);
    await expectAsync(
      numberTable.getValues().then((rows) => rows[0][0]),
    ).toBeResolvedTo('10');

    await numberTable.close();

    const currency = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'revenue-by-month' }),
    );

    const currencyTable = await currency.openDataTableModal();

    await expectAsync(currencyTable.getSeriesLabels()).toBeResolvedTo([
      'Revenue',
    ]);

    await expectAsync(
      currencyTable.getValues().then((rows) => rows[0][0]),
    ).toBeResolvedTo('€1,000');

    await currencyTable.close();

    const percent = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'conversion-rate-by-month' }),
    );

    const percentTable = await percent.openDataTableModal();

    await expectAsync(percentTable.getSeriesLabels()).toBeResolvedTo([
      'Conversion rate',
    ]);
    await expectAsync(
      percentTable.getValues().then((rows) => rows[0][0]),
    ).toBeResolvedTo('10%');

    await percentTable.close();
  });
});
