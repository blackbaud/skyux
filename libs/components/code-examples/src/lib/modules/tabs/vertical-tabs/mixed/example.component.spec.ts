import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyVerticalTabsetHarness } from '@skyux/tabs/testing';

import { TabsVerticalTabsMixedExampleComponent } from './example.component';

describe('Mixed vertical tabs example', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyVerticalTabsetHarness;
    fixture: ComponentFixture<TabsVerticalTabsMixedExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      TabsVerticalTabsMixedExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyVerticalTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsVerticalTabsMixedExampleComponent],
    });
  });

  it('should show grouped and ungrouped tabs', async () => {
    const { harness } = await setupTest({ dataSkyId: 'vertical-tabs-mixed' });

    // Test grouped tabs
    const group1 = await harness.getGroup({ groupHeading: 'Group 1' });
    expect(group1).toBeTruthy();
    expect(await group1?.isOpen()).toBe(true);

    const group2 = await harness.getGroup({ groupHeading: 'Group 2' });
    expect(group2).toBeTruthy();
    expect(await group2?.isOpen()).toBe(false);

    // Test ungrouped tabs
    const tab1 = await harness.getTab({ tabHeading: 'Tab 1' });
    expect(tab1).toBeTruthy();

    const tab2 = await harness.getTab({ tabHeading: 'Tab 2' });
    expect(tab2).toBeTruthy();
    expect(await tab2?.getTabHeaderCount()).toBe(3);

    const tab3 = await harness.getTab({ tabHeading: 'Tab 3' });
    expect(tab3).toBeTruthy();
    expect(await tab3?.isDisabled()).toBe(true);
  });

  it('should have the group 1 tab 1 active by default', async () => {
    const { harness } = await setupTest({ dataSkyId: 'vertical-tabs-mixed' });

    const group1Tab1 = await harness.getTab({ tabHeading: 'Group 1 — Tab 1' });
    expect(group1Tab1).toBeTruthy();
    expect(await group1Tab1?.isActive()).toBe(true);
  });
});
