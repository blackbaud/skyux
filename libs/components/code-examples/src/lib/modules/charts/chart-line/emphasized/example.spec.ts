import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartLineHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartLineEmphasizedExample } from './example';

describe('Line chart with an emphasized series example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartLineEmphasizedExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartLineEmphasizedExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'donations-by-fund' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading and subheading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Donations by fund',
    );
    await expectAsync(harness.getSubheadingText()).toBeResolvedTo(
      'Annual fund compared with other funds',
    );
  });

  it('should render the line chart plot', async () => {
    const { harness } = await setupTest();

    const lineHarness = await harness.queryHarness(SkyChartLineHarness);

    await expectAsync(lineHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should expose every series through the data table modal', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getSeriesLabels()).toBeResolvedTo([
      'Annual fund',
      'Capital campaign',
      'Scholarships',
    ]);
    await expectAsync(dataTable.getEmphasizedSeriesLabels()).toBeResolvedTo([
      'Annual fund',
    ]);

    await dataTable.close();
  });
});
