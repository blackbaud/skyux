import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartBarHarness, SkyChartHarness } from '@skyux/charts/testing';
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

  it('should show the details of the clicked bar', async () => {
    const { barHarness, fixture } = await setupTest();

    const dataPoint = await barHarness.getDataPoint({
      category: 'Q4',
      seriesLabelText: 'In person',
    });

    await dataPoint.click();

    expect(getSelectionText(fixture)).toBe(
      'In person donations in Q4: $45,100.00',
    );
  });

  it('should replace the details when another bar is clicked', async () => {
    const { barHarness, fixture } = await setupTest();

    await (
      await barHarness.getDataPoint({
        category: 'Q4',
        seriesLabelText: 'Online',
      })
    ).click();
    await (
      await barHarness.getDataPoint({
        category: 'Q1',
        seriesLabelText: 'Online',
      })
    ).click();

    expect(getSelectionText(fixture)).toBe(
      'Online donations in Q1: $42,000.00',
    );
  });
});
