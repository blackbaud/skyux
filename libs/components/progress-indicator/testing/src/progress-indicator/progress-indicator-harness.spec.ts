import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyProgressIndicatorModule } from '@skyux/progress-indicator';

import { SkyProgressIndicatorHarness } from './progress-indicator-harness';

// #region Test Component
@Component({
  selector: 'sky-progress-indicator-test',
  template: `
    <sky-progress-indicator [isPassive]="isPassive" [startingIndex]="1">
      <sky-progress-indicator-item
        data-sky-id="finished-step"
        helpPopoverContent="Example help content for finished step"
        helpPopoverTitle="Start here"
        title="Finished step"
        >Optional details about this step
      </sky-progress-indicator-item>
      <sky-progress-indicator-item
        data-sky-id="current-step"
        helpPopoverContent="Example help content for current step"
        title="Current step"
      />
      <sky-progress-indicator-item title="HIDDEN TITLE" />
    </sky-progress-indicator>
    <sky-progress-indicator data-sky-id="other-indicator" [isPassive]="true" />
  `,
})
class TestProgressIndicatorComponent {
  public isPassive = false;
}
// #endregion Test Component

describe('Progress indicator test harness', () => {
  async function setupTest(options: { dataSkyId?: string }): Promise<{
    progressIndicatorHarness: SkyProgressIndicatorHarness;
    fixture: ComponentFixture<TestProgressIndicatorComponent>;
  }> {
    await TestBed.configureTestingModule({
      declarations: [TestProgressIndicatorComponent],
      imports: [SkyProgressIndicatorModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestProgressIndicatorComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const progressIndicatorHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyProgressIndicatorHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyProgressIndicatorHarness);

    return { progressIndicatorHarness, fixture };
  }

  it('should get progress indicator by its data-sky-id', async () => {
    const { progressIndicatorHarness } = await setupTest({
      dataSkyId: 'other-indicator',
    });

    await expectAsync(progressIndicatorHarness.isPassive()).toBeResolvedTo(
      true,
    );
  });
});
