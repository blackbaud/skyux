import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import {
  SkyChart,
  SkyChartAxisCategory,
  SkyChartAxisValue,
  SkyChartBar,
  SkyChartBarSeries,
  SkyChartHeadingLevel,
  SkyChartHeadingStyle,
} from '@skyux/charts';

import { SkyChartBarHarness } from '../chart-bar/chart-bar-harness';
import { SkyChartHarness } from './chart-harness';

@Component({
  imports: [
    SkyChart,
    SkyChartAxisCategory,
    SkyChartAxisValue,
    SkyChartBar,
    SkyChartBarSeries,
  ],
  template: `
    <sky-chart
      data-sky-id="test-chart"
      headingText="Sales by region"
      helpPopoverTitle="About sales"
      [headingHidden]="headingHidden()"
      [headingLevel]="headingLevel()"
      [headingStyle]="headingStyle()"
      [helpPopoverContent]="helpPopoverContent()"
      [loading]="loading()"
      [subheadingText]="subheadingText()"
    >
      <sky-chart-bar>
        <sky-chart-axis-category
          labelText="Region"
          [categories]="['North', 'South']"
        />
        <sky-chart-axis-value labelText="Sales" />
        <sky-chart-bar-series labelText="2026" [values]="[10, 20]" />
      </sky-chart-bar>
    </sky-chart>
    <sky-chart data-sky-id="other-chart" headingText="Other chart" />
    <sky-chart headingHidden headingText="Hidden chart" />
  `,
})
class TestComponent {
  public readonly headingHidden = input(false);
  public readonly headingLevel = input<SkyChartHeadingLevel>(3);
  public readonly headingStyle = input<SkyChartHeadingStyle>(3);
  public readonly helpPopoverContent = input<string>();
  public readonly loading = input(false);
  public readonly subheadingText = input<string>();
}

describe('Chart harness', () => {
  async function setupTest(
    filters: { dataSkyId?: string; headingText?: string | RegExp } = {
      dataSkyId: 'test-chart',
    },
  ): Promise<{
    fixture: ComponentFixture<TestComponent>;
    harness: SkyChartHarness;
  }> {
    TestBed.configureTestingModule({
      providers: [provideNoopAnimations()],
    });

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness = await loader.getHarness(SkyChartHarness.with(filters));

    return { fixture, harness };
  }

  it('should locate a chart by its data-sky-id', async () => {
    const { harness } = await setupTest({ dataSkyId: 'other-chart' });

    await expectAsync(harness.getHeadingText()).toBeResolvedTo('Other chart');
  });

  it('should locate a chart by its heading text', async () => {
    const { harness } = await setupTest({ headingText: 'Other chart' });

    await expectAsync(harness.getHeadingText()).toBeResolvedTo('Other chart');
  });

  it('should locate a chart by a heading text pattern', async () => {
    const { harness } = await setupTest({ headingText: /by region/ });

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Sales by region',
    );
  });

  it('should throw when no chart matches the filters', async () => {
    await expectAsync(
      setupTest({ headingText: 'No such chart' }),
    ).toBeRejected();
  });

  it('should get the heading text', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(
      'Sales by region',
    );

    fixture.componentRef.setInput('headingHidden', true);

    await expectAsync(harness.getHeadingText()).toBeResolvedTo(undefined);
  });

  it('should get whether the heading is hidden', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getHeadingHidden()).toBeResolvedTo(false);

    fixture.componentRef.setInput('headingHidden', true);

    await expectAsync(harness.getHeadingHidden()).toBeResolvedTo(true);
  });

  it('should get the heading level', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getHeadingLevel()).toBeResolvedTo(3);

    fixture.componentRef.setInput('headingLevel', 5);

    await expectAsync(harness.getHeadingLevel()).toBeResolvedTo(5);

    fixture.componentRef.setInput('headingHidden', true);

    await expectAsync(harness.getHeadingLevel()).toBeResolvedTo(undefined);
  });

  it('should get the heading style', async () => {
    const { fixture, harness } = await setupTest();

    for (const headingStyle of [2, 3, 4, 5]) {
      fixture.componentRef.setInput('headingStyle', headingStyle);

      await expectAsync(harness.getHeadingStyle()).toBeResolvedTo(
        headingStyle as SkyChartHeadingStyle,
      );
    }

    fixture.componentRef.setInput('headingHidden', true);

    await expectAsync(harness.getHeadingStyle()).toBeResolvedTo(undefined);
  });

  it('should get the subheading text', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getSubheadingText()).toBeResolvedTo(undefined);

    fixture.componentRef.setInput('subheadingText', 'Fiscal year 2026');

    await expectAsync(harness.getSubheadingText()).toBeResolvedTo(
      'Fiscal year 2026',
    );
  });

  it('should get whether the chart is loading', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.isLoading()).toBeResolvedTo(false);

    fixture.componentRef.setInput('loading', true);

    await expectAsync(harness.isLoading()).toBeResolvedTo(true);
  });

  it('should interact with the help inline popover', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentRef.setInput('helpPopoverContent', 'Help content');

    await harness.clickHelpInline();

    await expectAsync(harness.getHelpPopoverContent()).toBeResolvedTo(
      'Help content',
    );
    await expectAsync(harness.getHelpPopoverTitle()).toBeResolvedTo(
      'About sales',
    );
  });

  it('should throw when interacting with a missing help inline button', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.clickHelpInline()).toBeRejectedWithError(
      'No help inline found.',
    );
    await expectAsync(harness.getHelpPopoverContent()).toBeRejectedWithError(
      'No help inline found.',
    );
    await expectAsync(harness.getHelpPopoverTitle()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should query the plot harness within the chart', async () => {
    const { harness } = await setupTest();

    const barHarness = await harness.queryHarness(SkyChartBarHarness);

    await expectAsync(barHarness.isChartRendered()).toBeResolvedTo(true);
  });
});
