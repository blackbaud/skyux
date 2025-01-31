import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyProgressIndicatorHarness } from '@skyux/progress-indicator/testing';

import { ProgressIndicatorPassiveIndicatorBasicExampleComponent } from './example.component';

describe('Basic passive progress indicator example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyProgressIndicatorHarness;
    fixture: ComponentFixture<ProgressIndicatorPassiveIndicatorBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      ProgressIndicatorPassiveIndicatorBasicExampleComponent,
    );
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
      dataSkyId: 'example-progress-indicator',
    });

    await expectAsync(harness.isPassive()).toBeResolvedTo(true);
    expect((await harness.getItems()).length).toBe(3);

    const finishedStep = harness.getItem({ dataSkyId: 'finished-step' });
    await expectAsync((await finishedStep).getTitle()).toBeResolvedTo(
      'Finished step',
    );
  });
});
