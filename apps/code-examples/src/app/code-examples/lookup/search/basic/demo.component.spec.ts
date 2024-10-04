import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyMediaBreakpoints, SkyMediaQueryService } from '@skyux/core';
import { MockSkyMediaQueryService } from '@skyux/core/testing';
import { SkySearchHarness } from '@skyux/lookup/testing';

import { DemoComponent } from './demo.component';

describe('Basic search demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkySearchHarness;
    fixture: ComponentFixture<DemoComponent>;
    mockMediaQuery: MockSkyMediaQueryService;
  }> {
    const mockMediaQuery = new MockSkyMediaQueryService();

    await TestBed.configureTestingModule({
      providers: [
        {
          provide: SkyMediaQueryService,
          useValue: mockMediaQuery,
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkySearchHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture, mockMediaQuery };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, DemoComponent],
    });
  });

  it('should setup search component', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'demo-search',
    });

    await expectAsync(harness.getAriaLabel()).toBeResolvedTo(
      'Search reminders',
    );
    await expectAsync(harness.getPlaceholderText()).toBeResolvedTo(
      'Search through reminders.',
    );
  });

  it('should interact with search function', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'demo-search',
    });

    await harness.enterText('Send');
    await expectAsync(harness.getValue()).toBeResolvedTo('Send');

    await harness.clickClearButton();
    await expectAsync(harness.getValue()).toBeResolvedTo('');
  });

  it('should interact with search on mobile', async () => {
    const { harness, fixture, mockMediaQuery } = await setupTest({
      dataSkyId: 'demo-search',
    });

    mockMediaQuery.fire(SkyMediaBreakpoints.xs);
    fixture.detectChanges();
    await fixture.whenStable();

    await harness.clickOpenSearchButton();
    await expectAsync(harness.isCollapsed()).toBeResolvedTo(false);

    await harness.enterText('Send');
    await expectAsync(harness.getValue()).toBeResolvedTo('Send');
  });
});
