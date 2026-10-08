import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartLineHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartLineGapsExample } from './example';

describe('Line chart with gaps example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartLineGapsExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartLineGapsExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'donations-by-month' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Donations by month',
    );
  });

  it('should render the line chart plot', async () => {
    const { harness } = await setupTest();

    const lineHarness = await harness.queryHarness(SkyChartLineHarness);

    await expectAsync(lineHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should render null values as empty cells in the data table', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    // One row per category; each row holds the single series' value.
    await expectAsync(
      dataTable.getValues().then((rows) => rows.map((row) => row[0])),
    ).toBeResolvedTo([
      '$1,200.00',
      '$1,500.00',
      '',
      '$1,800.00',
      '',
      '$2,200.00',
      '$2,500.00',
    ]);

    await dataTable.close();
  });
});
