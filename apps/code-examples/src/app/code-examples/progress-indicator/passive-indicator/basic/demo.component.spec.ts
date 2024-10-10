import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyProgressIndicatorHarness } from '@skyux/progress-indicator/testing';

import { DemoComponent } from './demo.component';

describe('Basic passive progress indicator demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyProgressIndicatorHarness;
    fixture: ComponentFixture<DemoComponent>;
  }> {
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyProgressIndicatorHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  it('should have the initial progress set', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'demo-progress-indicator',
    });

    await expectAsync(harness.isPassive()).toBeResolvedTo(true);
    expect((await harness.getItems()).length).toBe(3);

    const finishedStep = harness.getItem({ dataSkyId: 'finished-step' });
    await expectAsync((await finishedStep).getTitle()).toBeResolvedTo(
      'Finished step',
    );
  });
});
