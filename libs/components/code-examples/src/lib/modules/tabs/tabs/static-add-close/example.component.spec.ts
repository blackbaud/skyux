import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyTabsetHarness } from '@skyux/tabs/testing';

import { TabsStaticAddCloseExampleComponent } from './example.component';

describe('Static tabs demo with add and close', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyTabsetHarness;
    fixture: ComponentFixture<TabsStaticAddCloseExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(TabsStaticAddCloseExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsStaticAddCloseExampleComponent],
    });
  });

  it('should set up tabs', async () => {
    const { harness, fixture } = await setupTest({ dataSkyId: 'tab-demo' });

    const spy = spyOn(fixture.componentInstance, 'onNewTabClick');
    await harness.clickNewTabButton();

    expect(spy).toHaveBeenCalled();

    const tabButtonHarnesses = await harness.getTabButtonHarnesses();
    expect(tabButtonHarnesses.length).toBe(3);

    const activeTab = await harness.getActiveTabButton();
    await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 1');
  });

  it('should hide Tab 3 if it is closed', async () => {
    const { harness } = await setupTest({ dataSkyId: 'tab-demo' });

    const tab3Harness = await harness.getTabButtonHarness('Tab 3');
    await tab3Harness.clickRemoveButton();

    const tabButtons = await harness.getTabButtonHarnesses();
    expect(tabButtons.length).toBe(2);
  });
});
