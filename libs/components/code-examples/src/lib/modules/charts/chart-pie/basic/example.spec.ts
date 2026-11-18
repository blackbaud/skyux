import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartPieHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartPieBasicExample } from './example';

describe('Basic pie chart example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartPieBasicExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartPieBasicExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'sales-by-region' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Sales by region',
    );
  });

  it('should render the pie chart plot', async () => {
    const { harness } = await setupTest();

    const pieHarness = await harness.queryHarness(
      SkyChartPieHarness.with({ dataSkyId: 'sales-pie' }),
    );

    await expectAsync(pieHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should expose the chart data through the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Region');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo(['Sales']);
    await expectAsync(dataTable.getCategories()).toBeResolvedTo([
      'North',
      'South',
      'East',
      'West',
    ]);

    await dataTable.close();
  });
});
