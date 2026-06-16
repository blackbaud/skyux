import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyChartHeading } from './chart-heading';

describe('Chart heading component', () => {
  let fixture: ComponentFixture<SkyChartHeading>;

  function setInputs(level: number, style: number, text: string): void {
    fixture.componentRef.setInput('headingLevel', level);
    fixture.componentRef.setInput('headingStyle', style);
    fixture.componentRef.setInput('headingText', text);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChartHeading],
    });

    fixture = TestBed.createComponent(SkyChartHeading);
  });

  it('should render the heading text', () => {
    setInputs(3, 3, 'My heading');
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h3');
    expect(heading).toHaveText('My heading');
  });

  for (const level of [2, 3, 4, 5]) {
    it(`should render an h${level} for heading level ${level}`, () => {
      setInputs(level, 3, 'My heading');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector(`h${level}`)).toExist();
    });
  }

  for (const style of [2, 3, 4, 5]) {
    it(`should apply the sky-font-heading-${style} class for heading style ${style}`, () => {
      setInputs(3, style, 'My heading');
      fixture.detectChanges();

      expect(fixture.nativeElement.querySelector('h3')).toHaveCssClass(
        `sky-font-heading-${style}`,
      );
    });
  }

  describe('a11y', () => {
    it('should be accessible', async () => {
      setInputs(3, 3, 'My heading');
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
