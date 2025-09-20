import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyTabsetHarness } from '@skyux/tabs/testing';

import { TabsDynamicAddCloseExampleComponent } from './example.component';

describe('Static tabs demo with add and close', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyTabsetHarness;
    fixture: ComponentFixture<TabsDynamicAddCloseExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(
      TabsDynamicAddCloseExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TabsDynamicAddCloseExampleComponent],
    });
  });

  it('should set up tabs', async () => {
    const { harness } = await setupTest({ dataSkyId: 'tab-demo' });

    await harness.clickNewTabButton();
    const tabButtonHarnesses = await harness.getTabButtonHarnesses();
    expect(tabButtonHarnesses.length).toBe(4);

    const activeTab = await harness.getActiveTabButton();
    await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 1');
  });

  it('should hide Tab 3 if it is closed', async () => {
    const { harness } = await setupTest({ dataSkyId: 'tab-demo' });

    const tab3Harness = await harness.getTabButtonHarness({
      tabHeading: 'Tab 3',
    });
    await tab3Harness.clickRemoveButton();

    const tabButtons = await harness.getTabButtonHarnesses();
    expect(tabButtons.length).toBe(2);
  });
});
