import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyChart } from './chart';

@Component({
  imports: [SkyChart],
  template: `
    <sky-chart
      [headingHidden]="headingHidden"
      [headingLevel]="headingLevel"
      [headingStyle]="headingStyle"
      [headingText]="headingText"
      [subheadingText]="subheadingText"
    >
      <div class="test-chart-content">Chart content</div>
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

  function getHeadingElement(): HTMLElement | null {
    return fixture.nativeElement.querySelector(
      'sky-chart-heading :is(h2, h3, h4, h5)',
    );
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

  it('should project content', () => {
    fixture.detectChanges();

    const content = fixture.nativeElement.querySelector('.test-chart-content');
    expect(content).toHaveText('Chart content');
  });

  it('should default headingHidden to false', () => {
    fixture.detectChanges();

    expect(fixture.componentInstance.chart.headingHidden()).toBe(false);
    expect(getHeading()).not.toHaveCssClass('sky-screen-reader-only');
  });

  it('should visually hide the heading when headingHidden is true', () => {
    fixture.componentInstance.headingHidden = true;
    fixture.detectChanges();

    expect(getHeading()).toHaveCssClass('sky-screen-reader-only');
  });

  it('should name the figure with the heading via aria-labelledby', () => {
    fixture.componentInstance.headingHidden = true;
    fixture.componentInstance.subheadingText = 'My subheading';
    fixture.detectChanges();

    const labelledById = getFigure()?.getAttribute('aria-labelledby');
    expect(labelledById).toBeTruthy();

    const labelEl = fixture.nativeElement.querySelector(`#${labelledById}`);
    expect(labelEl?.contains(getHeadingElement())).toBe(true);
    expect(labelEl?.contains(getSubheading())).toBe(true);
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
