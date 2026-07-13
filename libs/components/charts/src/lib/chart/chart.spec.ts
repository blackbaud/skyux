import { Component, ViewChild, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyChartTableService } from '../chart-table/chart-table-service';

import { SkyChart } from './chart';

@Component({
  selector: 'sky-chart-bar',
  template: '',
})
class MockChartBarComponent {
  public readonly tableSvc = inject(SkyChartTableService);
}

@Component({
  imports: [SkyChart, MockChartBarComponent],
  template: `
    <sky-chart
      [headingHidden]="headingHidden"
      [headingLevel]="headingLevel"
      [headingStyle]="headingStyle"
      [headingText]="headingText"
      [subheadingText]="subheadingText"
    >
      <sky-chart-bar />
    </sky-chart>
  `,
})
class TestComponent {
  @ViewChild(SkyChart)
  public chart!: SkyChart;

  public headingHidden: boolean | undefined;
  public headingLevel: unknown;
  public headingStyle: unknown;
  public headingText = 'Test heading';
  public subheadingText: string | undefined;
}

describe('Chart component', () => {
  let fixture: ComponentFixture<TestComponent>;

  function getHeading(): HTMLElement | null {
    return fixture.nativeElement.querySelector('sky-chart-heading');
  }

  function getFigure(): HTMLElement | null {
    return fixture.nativeElement.querySelector('figure');
  }

  function getSubheading(): HTMLElement | null {
    return fixture.nativeElement.querySelector('sky-chart-subheading');
  }

  async function setPlotSummary(
    resourceKey: string,
    args: (string | number)[],
  ): Promise<void> {
    const plot = fixture.debugElement.query(By.directive(MockChartBarComponent))
      .componentInstance as MockChartBarComponent;

    plot.tableSvc.summary.set({ resourceKey, args });
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
    });

    fixture = TestBed.createComponent(TestComponent);
  });

  it('should set the sky-chart host class', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('sky-chart')).toHaveCssClass(
      'sky-chart',
    );
  });

  it('should render the heading text', () => {
    fixture.componentInstance.headingText = 'My chart';
    fixture.detectChanges();

    expect(getHeading()).toHaveText('My chart');
  });

  it('should project the plot content into the figure', () => {
    fixture.detectChanges();

    expect(getFigure()?.querySelector('sky-chart-bar')).not.toBeNull();
  });

  it('should default headingHidden to false', () => {
    fixture.detectChanges();

    expect(fixture.componentInstance.chart.headingHidden()).toBe(false);
    expect(getHeading()).not.toBeNull();
  });

  it('should not render the heading when headingHidden is true', () => {
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    expect(getHeading()).toBeNull();
  });

  it('should not name the figure when the heading is visible', () => {
    fixture.componentInstance.headingText = 'My heading';
    fixture.componentInstance.subheadingText = 'My subheading';
    fixture.detectChanges();

    expect(getFigure()?.getAttribute('aria-label')).toBeNull();
  });

  it('should name the figure with the heading text via aria-label when headingHidden is true', () => {
    fixture.componentInstance.headingText = 'My heading';
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    expect(getFigure()?.getAttribute('aria-label')).toBe('My heading');
  });

  it('should include the subheading text in the figure aria-label when headingHidden is true', () => {
    fixture.componentInstance.headingText = 'My heading';
    fixture.componentInstance.subheadingText = 'My subheading';
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    expect(getFigure()?.getAttribute('aria-label')).toBe(
      'My heading, My subheading',
    );
  });

  it('should not render the subheading when subheadingText is undefined', () => {
    fixture.detectChanges();

    expect(getSubheading()).toBeNull();
  });

  it('should render the subheading when subheadingText is set', () => {
    fixture.componentInstance.subheadingText = 'My subheading';
    fixture.detectChanges();

    expect(getSubheading()).toHaveText('My subheading');
  });

  it('should not render the heading or subheading when headingHidden is true', () => {
    fixture.componentInstance.headingText = 'My heading';
    fixture.componentInstance.subheadingText = 'My subheading';
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    expect(getHeading()).toBeNull();
    expect(getSubheading()).toBeNull();
    expect(getFigure()?.getAttribute('aria-label')).toBe(
      'My heading, My subheading',
    );
  });

  it('should default headingLevel and headingStyle', () => {
    fixture.detectChanges();

    expect(fixture.componentInstance.chart.headingLevel()).toBe(3);
    expect(fixture.componentInstance.chart.headingStyle()).toBe(3);
  });

  it('should transform the headingLevel input', () => {
    fixture.componentInstance.headingLevel = '2';
    fixture.detectChanges();

    expect(fixture.componentInstance.chart.headingLevel()).toBe(2);
    expect(getHeading()?.querySelector('h2')).toExist();
  });

  it('should transform the headingStyle input', () => {
    fixture.componentInstance.headingStyle = '4';
    fixture.detectChanges();

    expect(fixture.componentInstance.chart.headingStyle()).toBe(4);
  });

  it('should mark the figure as an image when it has an accessible name', async () => {
    fixture.detectChanges();
    await setPlotSummary('skyux_charts.chart.bar.accessible_summary', [3, 4]);

    expect(getFigure()?.getAttribute('role')).toBe('img');
  });

  it('should not mark the figure as an image when it has no accessible name', () => {
    fixture.detectChanges();

    expect(getFigure()?.getAttribute('role')).toBeNull();
  });

  it("should name the figure with the plot's descriptive summary when the heading is visible", async () => {
    fixture.detectChanges();
    await setPlotSummary('skyux_charts.chart.bar.accessible_summary', [3, 4]);

    expect(getFigure()?.getAttribute('aria-label')).toBe(
      "Bar chart with 3 series and 4 categories. A data table is available from the chart's context menu.",
    );
  });

  it("should combine the title and the plot's summary when the heading is hidden", async () => {
    fixture.componentInstance.headingText = 'My heading';
    fixture.componentInstance.subheadingText = 'My subheading';
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();
    await setPlotSummary('skyux_charts.chart.bar.accessible_summary', [3, 4]);

    expect(getFigure()?.getAttribute('aria-label')).toBe(
      "My heading, My subheading. Bar chart with 3 series and 4 categories. A data table is available from the chart's context menu.",
    );
  });

  it('should not name the figure when the plot has no summary and the heading is visible', () => {
    fixture.detectChanges();

    expect(getFigure()?.getAttribute('aria-label')).toBeNull();
  });

  describe('a11y', () => {
    it('should be accessible with default inputs', async () => {
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with a subheading', async () => {
      fixture.componentInstance.subheadingText = 'My subheading';
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with the heading hidden', async () => {
      fixture.componentInstance.headingHidden = true;
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });

    it('should be accessible with a plot summary', async () => {
      fixture.detectChanges();
      await setPlotSummary('skyux_charts.chart.bar.accessible_summary', [3, 4]);

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
