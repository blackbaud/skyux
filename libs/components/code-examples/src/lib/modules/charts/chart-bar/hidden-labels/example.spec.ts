import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartBarHarness, SkyChartHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartBarHiddenLabelsExample } from './example';

describe('Hidden axis labels bar chart example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartBarHiddenLabelsExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartBarHiddenLabelsExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'acquisitions-by-year-minimal' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Acquisitions by year',
    );
  });

  it('should render the bar chart plot', async () => {
    const { harness } = await setupTest();

    const barHarness = await harness.queryHarness(SkyChartBarHarness);

    await expectAsync(barHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should still label the axes in the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Year');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo([
      'Acquisitions by year',
    ]);

    await dataTable.close();
  });
});
