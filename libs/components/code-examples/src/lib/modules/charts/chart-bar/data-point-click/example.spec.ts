import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyChartBarHarness,
  SkyChartDataPointHarness,
  SkyChartHarness,
} from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartBarDataPointClickExample } from './example';

describe('Bar chart with clickable data points example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartBarDataPointClickExample>;
    barHarness: SkyChartBarHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(
      ChartsChartBarDataPointClickExample,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'donations-by-channel' }),
    );
    const barHarness = await harness.queryHarness(SkyChartBarHarness);

    return { fixture, barHarness };
  }

  function getSelectionText(
    fixture: ComponentFixture<ChartsChartBarDataPointClickExample>,
  ): string {
    const selection = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-sky-id="selection"]',
    );

    return selection?.textContent?.trim() ?? '';
  }

  it('should prompt the user to select a bar', async () => {
    const { fixture } = await setupTest();

    expect(getSelectionText(fixture)).toBe('Select a bar to see its details.');
  });

  it('should get a data point for each bar', async () => {
    const { barHarness } = await setupTest();

    const dataPoints = await barHarness.getDataPoints();

    expect(dataPoints.length).toBe(8);
  });

  it('should filter data points by category or series', async () => {
    const { barHarness } = await setupTest();

    const q3DataPoints = await barHarness.getDataPoints({ category: 'Q3' });

    await expectAsync(
      Promise.all(
        q3DataPoints.map((dataPoint) => dataPoint.getSeriesLabelText()),
      ),
    ).toBeResolvedTo(['Online', 'In person']);

    const onlineDataPoints = await barHarness.getDataPoints({
      seriesLabelText: 'Online',
    });

    await expectAsync(
      Promise.all(onlineDataPoints.map((dataPoint) => dataPoint.getCategory())),
    ).toBeResolvedTo(['Q1', 'Q2', 'Q3', 'Q4']);
  });

  it('should show the details of the clicked bar', async () => {
    const { barHarness, fixture } = await setupTest();

    const dataPoint = await barHarness.getDataPoint({
      category: 'Q4',
      seriesLabelText: 'In person',
    });

    await expectAsync(dataPoint.getCategory()).toBeResolvedTo('Q4');
    await expectAsync(dataPoint.getSeriesLabelText()).toBeResolvedTo(
      'In person',
    );

    await dataPoint.click();

    expect(getSelectionText(fixture)).toBe(
      'In person donations in Q4: $45,100.00',
    );
  });

  it('should find a data point directly with its harness', async () => {
    const { fixture } = await setupTest();
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const dataPoint = await loader.getHarness(
      SkyChartDataPointHarness.with({ category: 'Q1', seriesLabelText: /On/ }),
    );

    await dataPoint.click();

    expect(getSelectionText(fixture)).toBe(
      'Online donations in Q1: $42,000.00',
    );
  });
});
