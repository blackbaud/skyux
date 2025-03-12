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
      aria-labelledBy="Tabset label"
      [showTabsText]="showTabsText"
    >
      <sky-vertical-tab tabHeading="Tab 1" [active]="true">
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
});
