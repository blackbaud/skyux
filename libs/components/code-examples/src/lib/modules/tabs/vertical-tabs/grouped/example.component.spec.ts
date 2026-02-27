import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyVerticalTabsetHarness } from '@skyux/tabs/testing';

import { TabsVerticalTabsGroupedExampleComponent } from './example.component';

describe('Group vertical tabs example', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<TabsVerticalTabsGroupedExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      TabsVerticalTabsGroupedExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyVerticalTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsVerticalTabsGroupedExampleComponent],
    });
  });

  it('should set up vertical tabs', async () => {
    const { harness } = await setupTest({ dataSkyId: 'vertical-tabs-group' });

    const allTabs = await harness.getTabs();
    expect(allTabs.length).toBe(4);

    const groups = await harness.getGroups();
    expect(groups.length).toBe(3);

    const disabledGroup = await harness.getGroup({
      groupHeading: 'Disabled',
    });
    await expectAsync(disabledGroup?.isDisabled()).toBeResolvedTo(true);

    const group1Tab2 = await harness.getTab({ tabHeading: 'Group 1 — Tab 2' });
    await expectAsync(group1Tab2.getTabHeaderCount()).toBeResolvedTo(7);
  });

  it('should have active tab as the first tab in group 2', async () => {
    const { harness } = await setupTest({ dataSkyId: 'vertical-tabs-group' });

    // Two ways to get a tab inside a group
    // Through tabset harness
    const activeTab = await harness.getActiveTab();

    // Through group harness
    const group2 = await harness.getGroup({ groupHeading: 'Group 2' });
    await expectAsync(group2?.isActive()).toBeResolvedTo(true);

    const tab1 = await group2?.getVerticalTab({
      tabHeading: 'Group 2 — Tab 1',
    });

    const check =
      (await activeTab?.getTabHeading()) === (await tab1?.getTabHeading());
    expect(check).toBe(true);
  });
});
