import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartBarHarness, SkyChartHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartBarStackedExample } from './example';

describe('Stacked bar chart example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartBarStackedExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartBarStackedExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'monthly-sales' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo('Monthly sales');
  });

  it('should render the bar chart plot', async () => {
    const { harness } = await setupTest();

    const barHarness = await harness.queryHarness(SkyChartBarHarness);

    await expectAsync(barHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should expose every stacked series through the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Month');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo([
      'In store',
      'Online',
      'Phone',
    ]);

    await dataTable.close();
  });
});
