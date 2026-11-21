import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyChartHarness, SkyChartPieHarness } from '@skyux/charts/testing';
import { provideNoopSkyAnimations } from '@skyux/core';

import { ChartsChartPieDataPointClickExample } from './example';

describe('Pie chart with clickable slices example', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<ChartsChartPieDataPointClickExample>;
    pieHarness: SkyChartPieHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopSkyAnimations()],
    });

    const fixture = TestBed.createComponent(
      ChartsChartPieDataPointClickExample,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(
      SkyChartHarness.with({ dataSkyId: 'donations-by-channel' }),
    );
    const pieHarness = await harness.queryHarness(SkyChartPieHarness);

    return { fixture, pieHarness };
  }

  function getSelectionText(
    fixture: ComponentFixture<ChartsChartPieDataPointClickExample>,
  ): string {
    const selection = (fixture.nativeElement as HTMLElement).querySelector(
      '[data-sky-id="selection"]',
    );

    return selection?.textContent?.trim() ?? '';
  }

  it('should prompt the user to select a slice', async () => {
    const { fixture } = await setupTest();

    expect(getSelectionText(fixture)).toBe(
      'Select a slice to see its details.',
    );
  });

  it('should show the details of the clicked slice', async () => {
    const { fixture, pieHarness } = await setupTest();

    await (await pieHarness.getDataPoint({ category: 'In person' })).click();

    expect(getSelectionText(fixture)).toBe('In person donations: $64,600.00');
  });

  it('should replace the details when another slice is clicked', async () => {
    const { fixture, pieHarness } = await setupTest();

    await (await pieHarness.getDataPoint({ category: 'Online' })).click();

    expect(getSelectionText(fixture)).toBe('Online donations: $90,700.00');

    await (await pieHarness.getDataPoint({ category: 'Mail' })).click();

    expect(getSelectionText(fixture)).toBe('Mail donations: $28,300.00');
  });
});
