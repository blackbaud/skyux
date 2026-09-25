import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopSkyAnimations } from '@skyux/core';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import { SkyVerticalTabsetHarness } from '@skyux/tabs/testing';

import { TabsVerticalTabsLayoutExample } from './example';

describe('Vertical tabs layout example', () => {
  async function setupTest(): Promise<{
    harness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<TabsVerticalTabsLayoutExample>;
  }> {
    const fixture = TestBed.createComponent(TabsVerticalTabsLayoutExample);

    // Pin a wide breakpoint so the tabset renders its side-by-side layout
    // (and applies `tabWidth`) regardless of the test runner's window size.
    TestBed.inject(SkyMediaQueryTestingController).setBreakpoint('lg');

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyVerticalTabsetHarness.with({ dataSkyId: 'vertical-tabs-layout' }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsVerticalTabsLayoutExample],
      providers: [provideNoopSkyAnimations(), provideSkyMediaQueryTesting()],
    });
  });

  it('should set up vertical tabs with layout options', async () => {
    const { harness } = await setupTest();

    const allTabs = await harness.getTabs();
    expect(allTabs.length).toBe(3);

    const activeTab = await harness.getActiveTab();
    expect(await activeTab?.getTabHeading()).toBe('Blocks');

    const listTab = await harness.getTab({ tabHeading: 'List' });
    expect(await listTab?.isDisabled()).toBeFalse();

    const fitTab = await harness.getTab({ tabHeading: 'Fit' });
    const fitTabContent = await fitTab?.getTabContent();
    await fitTab?.click();
    expect(await fitTabContent?.isVisible()).toBeTrue();
  });
});
