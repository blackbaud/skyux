import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import { SkyVerticalTabsetHarness } from '@skyux/tabs/testing';

import { TabsVerticalTabsBasicExampleComponent } from './example.component';

describe('Basic vertical tabs example', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<TabsVerticalTabsBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      TabsVerticalTabsBasicExampleComponent,
    );

    // Pin a wide breakpoint so the tabset renders its side-by-side layout
    // (and applies `tabWidth`) regardless of the test runner's window size.
    TestBed.inject(SkyMediaQueryTestingController).setBreakpoint('lg');

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyVerticalTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsVerticalTabsBasicExampleComponent],
      providers: [provideNoopSkyAnimations(), provideSkyMediaQueryTesting()],
    });
  });

  it('should set up vertical tabs', async () => {
    const { harness } = await setupTest({ dataSkyId: 'vertical-tabs-basic' });

    await expectAsync(harness.getTabWidth()).toBeResolvedTo('auto');

    const allTabs = await harness.getTabs();
    expect(allTabs.length).toBe(3);

    const activeTab = await harness.getActiveTab();
    expect(await activeTab?.getTabHeading()).toBe('Tab 2');
    const activeTabContent = await activeTab?.getTabContent();
    expect(await activeTabContent?.isVisible()).toBeTrue();

    const disabledTab = await harness.getTab({
      tabHeading:
        'A very long tab heading that wraps when the width is constrained',
    });
    expect(await disabledTab?.isDisabled()).toBeTrue();
  });
});
