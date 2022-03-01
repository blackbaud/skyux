import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { MockSkyMediaQueryService } from '@skyux/core/testing';

import { SkyPageSummaryFixturesModule } from './fixtures/page-summary-fixtures.module';
import { SkyPageSummaryTestComponent } from './fixtures/page-summary.component.fixture';
import { SkyPageSummaryComponent } from './page-summary.component';

describe('Page summary component', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyPageSummaryFixturesModule],
    });
  });

  it('should move the key info section on extra-small screens', () => {
    function getSelector(size: string) {
      return `.sky-page-summary-key-info-${size} .sky-page-summary-key-info-container`;
    }

    const mockQueryService = new MockSkyMediaQueryService();

    const fixture = TestBed.overrideComponent(SkyPageSummaryComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockQueryService,
          },
        ],
      },
    }).createComponent(SkyPageSummaryTestComponent);

    fixture.detectChanges();

    const el = fixture.nativeElement;

    const xsSelector = getSelector('xs');
    const smSelector = getSelector('sm');

    expect(el.querySelector(xsSelector)).not.toExist();
    expect(el.querySelector(smSelector)).toExist();

    mockQueryService.fire(SkyMediaBreakpoints.xs);

    expect(el.querySelector(xsSelector)).toExist();
    expect(el.querySelector(smSelector)).not.toExist();
  });

  it('should have appropriate class when key info is present', fakeAsync(() => {
    const mockQueryService = new MockSkyMediaQueryService();

    const fixture = TestBed.overrideComponent(SkyPageSummaryComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockQueryService,
          },
        ],
      },
    }).createComponent(SkyPageSummaryTestComponent);

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

  it('should be accessible', async(() => {
    const mockQueryService = new MockSkyMediaQueryService();

    const fixture = TestBed.overrideComponent(SkyPageSummaryComponent, {
      add: {
        providers: [
          {
            provide: SkyMediaQueryService,
            useValue: mockQueryService,
          },
        ],
      },
    }).createComponent(SkyPageSummaryTestComponent);

    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
