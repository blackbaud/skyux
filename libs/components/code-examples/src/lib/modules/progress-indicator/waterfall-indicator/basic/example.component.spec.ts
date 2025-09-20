import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyProgressIndicatorHarness } from '@skyux/progress-indicator/testing';

import { ProgressIndicatorWaterfallIndicatorBasicExampleComponent } from './example.component';

describe('Basic passive progress indicator example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyProgressIndicatorHarness;
    fixture: ComponentFixture<ProgressIndicatorWaterfallIndicatorBasicExampleComponent>;
  }> {
    const fixture = TestBed.createComponent(
      ProgressIndicatorWaterfallIndicatorBasicExampleComponent,
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

    await expectAsync(harness.getTitle()).toBeResolvedTo(
      'Set up my connection',
    );

    const items = await harness.getItems();

    expect(items.length).toBe(4);

    const configureStep = harness.getItem({
      dataSkyId: 'configure-connection',
    });
    await expectAsync((await configureStep).getTitle()).toBeResolvedTo(
      'Configure connection',
    );
  });

  it('should reset connection setup', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'example-progress-indicator',
    });

    await harness.clickResetButton();
    const firstStep = (await harness.getItems())[0];
    await expectAsync(firstStep.isCompleted()).toBeResolvedTo(false);
  });
});
