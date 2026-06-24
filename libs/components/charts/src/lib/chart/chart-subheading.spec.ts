import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';

import { SkyChartSubheading } from './chart-subheading';

describe('Chart subheading component', () => {
  let fixture: ComponentFixture<SkyChartSubheading>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyChartSubheading],
    });

    fixture = TestBed.createComponent(SkyChartSubheading);
  });

  it('should render the subheading text', () => {
    fixture.componentRef.setInput('subheadingText', 'My subheading');
    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveText('My subheading');
  });

  describe('a11y', () => {
    it('should be accessible', async () => {
      fixture.componentRef.setInput('subheadingText', 'My subheading');
      fixture.detectChanges();

      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  });
});
