import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyTabsetHarness } from '@skyux/tabs/testing';

import { TabsStaticExampleComponent } from './example.component';

describe('Static tabs demo with add and close', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    harness: SkyTabsetHarness;
    fixture: ComponentFixture<TabsStaticExampleComponent>;
  }> {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
    }).compileComponents();
    const fixture = TestBed.createComponent(TabsStaticExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyTabsetHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TabsStaticExampleComponent] });
  });

  it('should set up tabs', async () => {
    const { harness } = await setupTest({ dataSkyId: 'tab-demo' });

    const tabButtonHarnesses = await harness.getTabButtonHarnesses();
    expect(tabButtonHarnesses.length).toBe(3);

    const activeTab = await harness.getActiveTabButton();
    await expectAsync(activeTab?.getTabHeading()).toBeResolvedTo('Tab 1');
  });
});
