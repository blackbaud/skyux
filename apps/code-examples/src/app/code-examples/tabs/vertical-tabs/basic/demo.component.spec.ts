import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyVerticalTabsetHarness } from '@skyux/tabs/testing';

import { DemoComponent } from './demo.component';

describe('Basic vertical tabs demo', () => {
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

  it('should set up vertical tabs', async () => {
    const { harness } = await setupTest({ dataSkyId: 'vertical-tabs-basic' });

    const allTabs = await harness.getTabs();
    expect(allTabs.length).toBe(3);

    const activeTab = await harness.getActiveTab();
    expect(await activeTab?.getTabHeading()).toBe('Tab 2');
    const activeTabContent = await activeTab?.getTabContent();
    expect(await activeTabContent?.isVisible()).toBeTrue();

    const disabledTab = await harness.getTab({ tabHeading: 'Tab 3' });
    expect(await disabledTab?.isDisabled()).toBeTrue();
  });
});
