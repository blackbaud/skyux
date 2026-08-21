import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartBarHarness, SkyChartHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartBarValueBoundsExample } from './example';

describe('Fixed value bounds bar chart example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartBarValueBoundsExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartBarValueBoundsExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'goal-completion' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading and subheading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Goal completion by month',
    );
    await expectAsync(harness.getSubheadingText()).toBeResolvedTo(
      'The percent value axis is pinned to 0–100% with min and max, so the scale stays fixed regardless of the plotted values.',
    );
  });

  it('should render the bar chart plot', async () => {
    const { harness } = await setupTest();

    const barHarness = await harness.queryHarness(SkyChartBarHarness);

    await expectAsync(barHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should format the values as percentages in the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategoryLabel()).toBeResolvedTo('Month');
    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo([
      'Goal completion',
    ]);
    await expectAsync(
      dataTable.getValues().then((rows) => rows[0][0]),
    ).toBeResolvedTo('62%');

    await dataTable.close();
  });
});
