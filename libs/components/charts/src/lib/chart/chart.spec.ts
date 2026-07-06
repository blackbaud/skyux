import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyChart } from './chart';

@Component({
  selector: 'sky-chart-bar',
  template: '',
})
class MockChartBarComponent {}

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
      <div class="test-not-projected">Not projected</div>
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

  it('should project sky-chart-bar content into the figure', () => {
    fixture.detectChanges();

    expect(getFigure()?.querySelector('sky-chart-bar')).not.toBeNull();
  });

  it('should not project content other than sky-chart-bar', () => {
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.test-not-projected'),
    ).toBeNull();
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
  });
});
