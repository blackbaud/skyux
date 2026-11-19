import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartLineHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartLineDataPointClickExample } from './example';

describe('Line chart with clickable data points example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartLineDataPointClickExample>;
    lineHarness: SkyChartLineHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(
      ChartsChartLineDataPointClickExample,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'monthly-donations' }),
    );
    const lineHarness = await harness.queryHarness(SkyChartLineHarness);

    return { fixture, lineHarness };
  }

  function getSelectionText(
    fixture: ComponentFixture<ChartsChartLineDataPointClickExample>,
  ): string {
    const selection = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-sky-id="selection"]',
    );

    return selection?.textContent?.trim() ?? '';
  }

  it('should prompt the user to select a data point', async () => {
    const { fixture } = await setupTest();

    expect(getSelectionText(fixture)).toBe(
      'Select a data point to see its details.',
    );
  });

  it('should show the details of the clicked data point', async () => {
    const { fixture, lineHarness } = await setupTest();

    const dataPoint = await lineHarness.getDataPoint({
      category: 'Jun',
      seriesLabelText: 'In person',
    });

    await dataPoint.click();

    expect(getSelectionText(fixture)).toBe(
      'In person donations in Jun: $12,600.00',
    );
  });

  it('should replace the details when another data point is clicked', async () => {
    const { fixture, lineHarness } = await setupTest();

    await (
      await lineHarness.getDataPoint({
        category: 'Jun',
        seriesLabelText: 'Online',
      })
    ).click();
    await (
      await lineHarness.getDataPoint({
        category: 'Jan',
        seriesLabelText: 'Online',
      })
    ).click();

    expect(getSelectionText(fixture)).toBe(
      'Online donations in Jan: $12,400.00',
    );
  });
});
