import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartLineHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartLineTimeScaleExample } from './example';

describe('Line chart with a time axis example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartLineTimeScaleExample>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(ChartsChartLineTimeScaleExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'event-attendance' }),
    );

    return { fixture, harness };
  }

  it('should render the chart with the expected heading', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Event attendance',
    );
  });

  it('should render the line chart plot', async () => {
    const { harness } = await setupTest();

    const lineHarness = await harness.queryHarness(SkyChartLineHarness);

    await expectAsync(lineHarness.isChartRendered()).toBeResolvedTo(true);
  });

  it('should show each event date in full in the data table', async () => {
    const { harness } = await setupTest();

    const dataTable = await harness.openDataTableModal();

    await expectAsync(dataTable.getCategories()).toBeResolvedTo([
      'Jan 17, 2026',
      'Feb 7, 2026',
      'Feb 21, 2026',
      'Apr 11, 2026',
      'Jun 13, 2026',
      'Jun 27, 2026',
      'Sep 19, 2026',
      'Nov 7, 2026',
    ]);

    await dataTable.close();
  });
});
