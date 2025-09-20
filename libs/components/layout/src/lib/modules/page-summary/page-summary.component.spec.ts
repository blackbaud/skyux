import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';

import { SkyPageSummaryFixturesModule } from './fixtures/page-summary-fixtures.module';
import { SkyPageSummaryTestComponent } from './fixtures/page-summary.component.fixture';

describe('Page summary component', () => {
  let mediaQueryController: SkyMediaQueryTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageSummaryFixturesModule],
      providers: [provideSkyMediaQueryTesting()],
    });

    mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
  });

  it('should move the key info section on extra-small screens', () => {
    function getSelector(size: string) {
      return `.sky-page-summary-key-info-${size} .sky-page-summary-key-info-container`;
    }

    const fixture = TestBed.createComponent(SkyPageSummaryTestComponent);

    fixture.detectChanges();

    const el = fixture.nativeElement;

    const xsSelector = getSelector('xs');
    const smSelector = getSelector('sm');

    expect(el.querySelector(xsSelector)).not.toExist();
    expect(el.querySelector(smSelector)).toExist();

    mediaQueryController.setBreakpoint('xs');
    fixture.detectChanges();

    expect(el.querySelector(xsSelector)).toExist();
    expect(el.querySelector(smSelector)).not.toExist();
  });

  it('should have appropriate class when key info is present', fakeAsync(() => {
    const fixture = TestBed.createComponent(SkyPageSummaryTestComponent);
    mediaQueryController.setBreakpoint('md');

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    const el = fixture.nativeElement;
    expect(el.querySelector('.sky-page-summary-with-key-info')).toExist();

    const cmp = fixture.componentInstance as SkyPageSummaryTestComponent;
    cmp.showKeyInfo = false;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    expect(el.querySelector('.sky-page-summary-with-key-info')).not.toExist();
  }));

  it('should be accessible', async () => {
    const fixture = TestBed.createComponent(SkyPageSummaryTestComponent);

    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
