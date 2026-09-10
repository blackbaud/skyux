import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartPieHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartPieDonutExample } from './example';

describe('Donut chart example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartPieDonutExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartPieDonutExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'revenue-by-channel' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Revenue by channel',
    );
  });

  it('should render the donut chart plot', async () => {
    const { harness } = await setupTest();

    const pieHarness = await harness.queryHarness(
      SkyChartPieHarness.with({ dataSkyId: 'revenue-donut' }),
    );

    await expectAsync(pieHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should expose the formatted chart data through the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Channel');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo(['Revenue']);
    await expectAsync(dataTable.getCategories()).toBeResolvedTo([
      'In store',
      'Online',
      'Phone',
    ]);

    await dataTable.close();
  });
});
