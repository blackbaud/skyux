import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyVerticalTabsetModule } from '@skyux/tabs';

import { SkyVerticalTabsetHarness } from './vertical-tabset-harness';

@Component({
  standalone: true,
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
  public showTabsText = false;
  public groups: TabGroup[] = [
    {
      heading: 'Group 1',
      subTabs: [
        {
          tabHeading: 'Tab 3',
          content: 'Tab 3 content',
        },
        {
          tabHeading: 'Tab 4',
          content: 'Tab 4 content',
        },
      ],
    },
    {
      heading: 'Disabled group',
      isDisabled: true,
      subTabs: [],
    },
  ];
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

fdescribe('Vertical Tabset harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    tabsetHarness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
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
    const tabInsideGroup = await tabsetHarness.getTabByHeading('Tab 3');
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
    const disabledGroup =
      await tabsetHarness.getGroupByHeading('Disabled group');
    await expectAsync(disabledGroup?.isDisabled()).toBeResolvedTo(true);
  });

  it('should get the vertical tabset groups', async () => {
    const { tabsetHarness } = await setupTest();
    const groups = await tabsetHarness.getGroups();
    expect(groups.length).toBe(2);
  });

  it('should get tab harness by heading', async () => {
    const { tabsetHarness } = await setupTest();
    const tab = await tabsetHarness.getTabByHeading('Tab 2');
    await expectAsync(tab.isDisabled()).toBeResolvedTo(true);
  });

  it('should get all tabs in tabset', async () => {
    const { tabsetHarness } = await setupTest();
    const tabs = await tabsetHarness.getTabs();
    expect(tabs.length).toBe(4);
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

  // describe('in mobile view', () => {
  //   async function shrinkScreen(
  //     fixture: ComponentFixture<TestComponent>,
  //   ): Promise<void> {
  //     // todo figure out where xs is set to 50px lol
  //     fixture.nativeElement.style.width = '50px';
  //     SkyAppTestUtility.fireDomEvent(window, 'resize');
  //     fixture.detectChanges();
  //     await fixture.whenStable();
  //     await fixture.whenRenderingDone();
  //   }

  //   fit('should click the show tabs button', async () => {
  //     const { tabsetHarness, fixture } = await setupTest();
  //     await shrinkScreen(fixture);
  //     await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(false);

  //     await tabsetHarness.clickShowTabsButton();
  //     await expectAsync(tabsetHarness.isTabsVisible()).toBeResolvedTo(true);
  //   });
  // });
});
