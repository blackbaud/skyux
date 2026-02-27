import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyMediaQueryTestingController,
  provideSkyMediaQueryTesting,
} from '@skyux/core/testing';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { SkyVerticalTabsetHarness } from './vertical-tabset-harness';

@Component({
  imports: [SkyVerticalTabsetModule],
  template: `
    <sky-vertical-tabset
      ariaLabel="Vertical tabset"
      ariaLabelledBy="Tabset label"
      [showTabsText]="showTabsText"
    >
      <sky-vertical-tab
        tabHeading="Tab 1"
        [active]="active"
        [tabHeaderCount]="15"
      >
        Tab 1 content
      </sky-vertical-tab>
      <sky-vertical-tab
        data-sky-id="disabled-tab"
        tabHeading="Tab 2"
        [disabled]="true"
      >
        Tab 2 content
      </sky-vertical-tab>
      @for (group of groups; track group) {
        <sky-vertical-tabset-group
          [groupHeading]="group.heading"
          [disabled]="group.isDisabled"
          [open]="group.isOpen"
        >
          @for (tab of group.subTabs; track tab) {
            <sky-vertical-tab
              [active]="tab.active"
              [tabHeading]="tab.tabHeading"
              [tabHeaderCount]="tab.tabHeaderCount"
              [disabled]="tab.disabled"
            >
              {{ tab.content }}
            </sky-vertical-tab>
          }
        </sky-vertical-tabset-group>
      }
    </sky-vertical-tabset>
    <sky-vertical-tabset
      ariaLabel="Vertical tabset 2"
      data-sky-id="other-tabset"
    >
      <sky-vertical-tab tabHeading="Other tabset"></sky-vertical-tab>
    </sky-vertical-tabset>
  `,
})
class TestComponent {
  public active = true;
  public showTabsText: string | undefined;
  public groups: TabGroup[] = [
    {
      heading: 'Group 1',
      isOpen: false,
      subTabs: [
        {
          tabHeading: 'Tab 3',
          content: 'Tab 3 content',
        },
        {
          tabHeading: 'Tab 4',
          content: 'Tab 4 content',
          disabled: true,
        }],
    },
    {
      heading: 'Disabled group',
      isDisabled: true,
      subTabs: [],
    }];
}
interface TabGroup {
  heading: string;
  isOpen?: boolean;
  isDisabled?: boolean;
  subTabs: {
    tabHeading: string;
    content: string;
    tabHeaderCount?: number;
    active?: boolean;
    disabled?: boolean;
  }[];
}

describe('Vertical Tabset harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    tabsetHarness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [provideSkyMediaQueryTesting()],
    }).compileComponents();
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const tabsetHarness: SkyVerticalTabsetHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyVerticalTabsetHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyVerticalTabsetHarness);

    return { tabsetHarness, fixture };
  }

  it('should get vertical tabset by data-sky-id', async () => {
    const { tabsetHarness } = await setupTest({
      dataSkyId: 'other-tabset',
    });

    await expectAsync(tabsetHarness.getAriaLabel()).toBeResolvedTo(
      'Vertical tabset 2',
    );
  });

  it('should get the active tab', async () => {
    const { tabsetHarness } = await setupTest();
    const activeTab = await tabsetHarness.getActiveTab();
    await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 1');
  });

  it('should get the active tab from inside a group', async () => {
    const { tabsetHarness } = await setupTest();
    const tabInsideGroup = await tabsetHarness.getTab({ tabHeading: 'Tab 3' });
    await tabInsideGroup.click();

    const activeTab = await tabsetHarness.getActiveTab();
    await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 3');
  });

  it('should return undefined when no tab is active', async () => {
    const { tabsetHarness, fixture } = await setupTest();
    fixture.componentInstance.active = false;
    fixture.detectChanges();

    await expectAsync(tabsetHarness.getActiveTab()).toBeResolvedTo(undefined);
  });

  it('should get the active tab content harness', async () => {
    const { tabsetHarness } = await setupTest();
    const activeTabContent = await tabsetHarness.getActiveTabContent();
    await expectAsync(activeTabContent?.isVisible()).toBeResolvedTo(true);
  });

  it('should return no content when there is no active tab', async () => {
    const { tabsetHarness, fixture } = await setupTest();
    fixture.componentInstance.active = false;
    fixture.detectChanges();

    await expectAsync(tabsetHarness.getActiveTabContent()).toBeResolvedTo(
      undefined,
    );
  });

  it('should get the vertical tabset aria-label', async () => {
    const { tabsetHarness } = await setupTest();
    await expectAsync(tabsetHarness.getAriaLabel()).toBeResolvedTo(
      'Vertical tabset',
    );
  });

  it('should get the vertical tabset aria-labelledby', async () => {
    const { tabsetHarness } = await setupTest();
    await expectAsync(tabsetHarness.getAriaLabelledBy()).toBeResolvedTo(
      'Tabset label',
    );
  });

  it('should get the vertical tabset group by heading', async () => {
    const { tabsetHarness } = await setupTest();
    const disabledGroup = await tabsetHarness.getGroup({
      groupHeading: 'Disabled group',
    });
    await expectAsync(disabledGroup?.isDisabled()).toBeResolvedTo(true);
  });

  it('should get the vertical tabset groups', async () => {
    const { tabsetHarness } = await setupTest();
    const groups = await tabsetHarness.getGroups();
    expect(groups.length).toBe(2);
  });

  it('should get vertical tabset groups with filters', async () => {
    const { tabsetHarness } = await setupTest();
    const groups = await tabsetHarness.getGroups({ groupHeading: 'Group 1' });
    expect(groups.length).toBe(1);
    await expectAsync(groups[0].getGroupHeading()).toBeResolvedTo('Group 1');
  });

  it('should get a vertical tabset group with filters', async () => {
    const { tabsetHarness } = await setupTest();
    const group = await tabsetHarness.getGroup({ groupHeading: 'Group 1' });

    await expectAsync(group?.getGroupHeading()).toBeResolvedTo('Group 1');
  });

  it('should get tab harness by heading', async () => {
    const { tabsetHarness } = await setupTest();
    const tab = await tabsetHarness.getTab({ tabHeading: 'Tab 2' });
    await expectAsync(tab.isDisabled()).toBeResolvedTo(true);
  });

  it('should get all tabs in tabset', async () => {
    const { tabsetHarness } = await setupTest();
    const tabs = await tabsetHarness.getTabs();
    expect(tabs.length).toBe(4);
  });

  it('should get tabs with filters', async () => {
    const { tabsetHarness } = await setupTest();
    const tabs = await tabsetHarness.getTabs({ tabHeading: 'Tab 1' });
    expect(tabs.length).toBe(1);
    await expectAsync(tabs[0].getTabHeading()).toBeResolvedTo('Tab 1');
  });

  it('should get a single tab with filters', async () => {
    const { tabsetHarness } = await setupTest();
    const tab = await tabsetHarness.getTab({ tabHeading: 'Tab 2' });

    await expectAsync(tab.getTabHeading()).toBeResolvedTo('Tab 2');
  });

  it('should not return show tab text when not in mobile view', async () => {
    const { tabsetHarness } = await setupTest();
    await expectAsync(tabsetHarness.getShowTabsText()).toBeResolvedTo(
      undefined,
    );
  });

  it('should get the tab header count', async () => {
    const { tabsetHarness } = await setupTest();

    const activeTab = await tabsetHarness.getActiveTab();

    await expectAsync(activeTab?.getTabHeaderCount()).toBeResolvedTo(15);
  });

  describe('vertical tabset group', () => {
    it('should click the group header to open and close the group', async () => {
      const { tabsetHarness } = await setupTest();
      const group1 = await tabsetHarness.getGroup({ groupHeading: 'Group 1' });
      await expectAsync(group1?.isOpen()).toBeResolvedTo(false);

      await group1?.click();
      await expectAsync(group1?.isOpen()).toBeResolvedTo(true);
    });

    it('should get a tab harness inside a group by filter', async () => {
      const { tabsetHarness } = await setupTest();
      const group1 = await tabsetHarness.getGroup({ groupHeading: 'Group 1' });
      const tab = await group1?.getVerticalTab({ tabHeading: 'Tab 4' });
      await expectAsync(tab?.isDisabled()).toBeResolvedTo(true);
    });

    it('should get all tab harnesses inside a group', async () => {
      const { tabsetHarness } = await setupTest();
      const group1 = await tabsetHarness.getGroup({ groupHeading: 'Group 1' });
      const tabs = await group1?.getVerticalTabs();
      expect(tabs?.length).toBe(2);
    });

    it('should get tab harnesses inside a group with filters', async () => {
      const { tabsetHarness } = await setupTest();
      const group1 = await tabsetHarness.getGroup({ groupHeading: 'Group 1' });
      const tabs = await group1?.getVerticalTabs({ tabHeading: 'Tab 3' });
      expect(tabs?.length).toBe(1);
      await expectAsync(tabs?.[0].getTabHeading()).toBeResolvedTo('Tab 3');
    });

    it('should get if the group is active', async () => {
      const { tabsetHarness } = await setupTest();
      const group1 = await tabsetHarness.getGroup({ groupHeading: 'Group 1' });
      await expectAsync(group1?.isActive()).toBeResolvedTo(false);

      const tab = await group1?.getVerticalTab({ tabHeading: 'Tab 3' });
      await tab?.click();

      await expectAsync(group1?.isActive()).toBeResolvedTo(true);
    });
  });

  describe('in mobile view', () => {
    let mediaQueryController: SkyMediaQueryTestingController;

    function shrinkScreen(fixture: ComponentFixture<TestComponent>): void {
      mediaQueryController = TestBed.inject(SkyMediaQueryTestingController);
      mediaQueryController.setBreakpoint('xs');
      fixture.detectChanges();
    }

    it('should click the show tabs button', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      shrinkScreen(fixture);
      await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(false);

      await tabsetHarness.clickShowTabsButton();
      await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(true);
    });

    it('should get the active content', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      shrinkScreen(fixture);

      const content = await tabsetHarness.getActiveTabContent();
      await expectAsync(content?.isVisible()).toBeResolvedTo(true);
    });

    it('should click the show tab button and get groups', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      shrinkScreen(fixture);
      await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(false);

      const groups = await tabsetHarness.getGroups();
      await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(true);
      expect(groups.length).toBe(2);
    });

    it('should get the show tabs text', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      fixture.componentInstance.showTabsText = 'Test button';
      fixture.detectChanges();
      shrinkScreen(fixture);

      await expectAsync(tabsetHarness.getShowTabsText()).toBeResolvedTo(
        'Test button',
      );
    });

    it('should click the show tabs button and get all tabs', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      shrinkScreen(fixture);
      await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(false);

      const tabs = await tabsetHarness.getTabs();
      await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(true);
      expect(tabs.length).toBe(4);
    });

    it('should get groups with filters in mobile view', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      shrinkScreen(fixture);

      const groups = await tabsetHarness.getGroups({ groupHeading: 'Group 1' });
      expect(groups.length).toBe(1);
      await expectAsync(groups[0].getGroupHeading()).toBeResolvedTo('Group 1');
    });

    it('should get tabs with filters in mobile view', async () => {
      const { tabsetHarness, fixture } = await setupTest();
      shrinkScreen(fixture);

      const tabs = await tabsetHarness.getTabs({ tabHeading: 'Tab 2' });
      expect(tabs.length).toBe(1);
      await expectAsync(tabs[0].getTabHeading()).toBeResolvedTo('Tab 2');
    });
  });
});
