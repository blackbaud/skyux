import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyVerticalTabsetHarness } from '@skyux/tabs/testing';

import { DemoComponent } from './demo.component';

fdescribe('Basic vertical tabs demo', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyVerticalTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    });
  });

  fit('should set up vertical tabs', async () => {
    const { harness } = await setupTest({ dataSkyId: 'vertical-tabs-group' });

    const allTabs = await harness.getTabs();
    for (const tab of allTabs) {
      console.log(await tab.getTabHeading());
    }
    // expect(allTabs.length).toBe(4);

    // const groups = await harness.getGroups();
    // expect(groups.length).toBe(2);

    // const activeTab = await harness.getActiveTab();

    // const group2 = await harness.getGroup({ groupHeading: 'Group 2' });
    // await expectAsync(group2?.isActive()).toBeResolvedTo(true);
    // const tab2 = await group2?.getVerticalTab({
    //   tabHeading: 'Group 2 — Tab 1',
    // });
    // expect(activeTab === tab2).toBeTrue();
  });
});
