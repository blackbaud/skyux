import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyHelpTestingModule } from '@skyux/core/testing';

import { SkyBarChartHarness } from './bar-chart-harness';
import { BarChartHarnessTestComponent } from './fixtures/bar-chart-harness-test.component';

describe('Bar chart test harness', () => {
  async function setupTest(
    options: {
      dataSkyId?: string;
    } = {},
  ): Promise<{
    boxHarness: SkyBarChartHarness;
    fixture: ComponentFixture<BarChartHarnessTestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [BarChartHarnessTestComponent, SkyHelpTestingModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(BarChartHarnessTestComponent);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    const barChartHarness: SkyBarChartHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyBarChartHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyBarChartHarness);

    return { boxHarness: barChartHarness, fixture, loader };
  }

  it('should work', async () => {
    const { fixture } = await setupTest();

    fixture.detectChanges();

    expect(true).toBeFalse();
  });
});
