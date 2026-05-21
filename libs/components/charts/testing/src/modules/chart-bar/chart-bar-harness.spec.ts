import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyChartBarHarness } from './chart-bar-harness';
import { BarChartHarnessTestComponent } from './fixtures/chart-bar-harness-test.component';

describe('Bar chart test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    boxHarness: SkyChartBarHarness;
    fixture: ComponentFixture<BarChartHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [BarChartHarnessTestComponent, SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(BarChartHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const barChartHarness: SkyChartBarHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyChartBarHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyChartBarHarness);

    return { boxHarness: barChartHarness, fixture, loader };
  }

  it('should work', async () => {
    const { fixture } = await setupTest();

    fixture.detectChanges();

    expect(true).toBeFalse();
  });
});
