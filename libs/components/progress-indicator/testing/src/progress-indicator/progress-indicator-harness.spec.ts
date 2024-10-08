import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
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
        data-sky-id="unfinished-step"
        title="Current step"
      />
      <sky-progress-indicator-item
        data-sky-id="unfinished-step"
        title="HIDDEN TITLE"
      />
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
      imports: [SkyProgressIndicatorModule, NoopAnimationsModule],
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

  it('should get progress indicator item by data-sky-id', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const itemHarness = await progressIndicatorHarness.getItem({
      dataSkyId: 'finished-step',
    });

    await expectAsync(itemHarness.isCompleted()).toBeResolvedTo(true);
  });

  it('should get an array of all items', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const items = await progressIndicatorHarness.getItems();

    expect(items.length).toBe(3);
  });

  it('should get an array of items based on criteria', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const items = await progressIndicatorHarness.getItems({
      dataSkyId: 'unfinished-step',
    });

    expect(items.length).toBe(2);
  });

  it('should throw an error if no items are found', async () => {
    const { progressIndicatorHarness } = await setupTest({
      dataSkyId: 'other-indicator',
    });

    await expectAsync(
      progressIndicatorHarness.getItems(),
    ).toBeRejectedWithError('Unable to find any progress indicator items.');
  });

  it('should throw an error if no items are found matching criteria', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    await expectAsync(
      progressIndicatorHarness.getItems({
        dataSkyId: 'unknown-step',
      }),
    ).toBeRejectedWithError(
      'Unable to find any progress indicator items with filter(s): {"dataSkyId":"unknown-step"}',
    );
  });

  it('should get whether the progress indicator is passive', async () => {
    const { progressIndicatorHarness, fixture } = await setupTest({});

    await expectAsync(progressIndicatorHarness.isPassive()).toBeResolvedTo(
      false,
    );

    fixture.componentInstance.isPassive = true;
    fixture.detectChanges();

    await expectAsync(progressIndicatorHarness.isPassive()).toBeResolvedTo(
      true,
    );
  });

  it('should click help inline button', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const item = await progressIndicatorHarness.getItem({
      dataSkyId: 'finished-step',
    });

    await item.clickHelpInline();

    await expectAsync(item.getHelpPopoverContent()).toBeResolved();
  });

  it('should throw an error if no help inline is found', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const item = await progressIndicatorHarness.getItem({
      dataSkyId: 'unfinished-step',
    });

    await expectAsync(item.getHelpPopoverContent()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should get help popover content', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const item = await progressIndicatorHarness.getItem({
      dataSkyId: 'finished-step',
    });

    await item.clickHelpInline();

    await expectAsync(item.getHelpPopoverContent()).toBeResolvedTo(
      'Example help content for finished step',
    );
  });

  it('should get help popover title', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const item = await progressIndicatorHarness.getItem({
      dataSkyId: 'finished-step',
    });

    await item.clickHelpInline();

    await expectAsync(item.getHelpPopoverTitle()).toBeResolvedTo('Start here');
  });

  it('should get the progress indicator item title', async () => {
    const { progressIndicatorHarness } = await setupTest({});

    const item = await progressIndicatorHarness.getItem({
      dataSkyId: 'finished-step',
    });

    await expectAsync(item.getTitle()).toBeResolvedTo('Finished step');
  });
});
