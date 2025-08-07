import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyCharacterCounterModule } from '@skyux/forms';

import { SkyCharacterCounterIndicatorHarness } from './character-counter-indicator-harness';

@Component({
  imports: [SkyCharacterCounterModule],
  template: `
    <sky-character-counter-indicator
      data-sky-id="test-character-counter-indicator"
      [characterCount]="characterCount"
      [characterCountLimit]="characterLimit"
    />
    <sky-character-counter-indicator
      data-sky-id="test-character-counter-indicator-2"
      [characterCount]="1"
      [characterCountLimit]="2"
    />
    <sky-character-counter-indicator
      data-sky-id="test-character-counter-indicator-no-inputs"
      [characterCount]="NaN"
      [characterCountLimit]="Infinity"
    />
  `,
})
class TestComponent {
  public characterCount = 0;
  public characterLimit = 100;
}

describe('Character counter indicator harness', () => {
  async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
    harness: SkyCharacterCounterIndicatorHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    let harness: SkyCharacterCounterIndicatorHarness;

    if (options.dataSkyId) {
      harness = await loader.getHarness(
        SkyCharacterCounterIndicatorHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      );
    } else {
      harness = await loader.getHarness(SkyCharacterCounterIndicatorHarness);
    }

    return { harness, fixture, loader };
  }

  it('should return the character count', async () => {
    const { harness, fixture } = await setupTest();

    await expectAsync(harness.getCharacterCount()).toBeResolvedTo(0);
    await expectAsync(harness.getCharacterCountLimit()).toBeResolvedTo(100);

    fixture.componentInstance.characterCount = 10;
    fixture.componentInstance.characterLimit = 50;
    fixture.detectChanges();

    await expectAsync(harness.getCharacterCount()).toBeResolvedTo(10);
    await expectAsync(harness.getCharacterCountLimit()).toBeResolvedTo(50);
  });

  it('should return whether the character limit has been exceeded', async () => {
    const { harness, fixture } = await setupTest();

    await expectAsync(harness.isOverLimit()).toBeResolvedTo(false);

    fixture.componentInstance.characterCount = 101;
    fixture.detectChanges();

    await expectAsync(harness.isOverLimit()).toBeResolvedTo(true);
  });

  it('should get a character counter indicator by its data-sky-id property', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'test-character-counter-indicator-2',
    });

    await expectAsync(harness.getCharacterCount()).toBeResolvedTo(1);
    await expectAsync(harness.getCharacterCountLimit()).toBeResolvedTo(2);
  });

  it('should throw an error when no inputs are specified', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'test-character-counter-indicator-no-inputs',
    });

    await expectAsync(harness.isOverLimit()).toBeResolvedTo(false);

    await expectAsync(harness.getCharacterCount()).toBeRejectedWithError(
      'The character counter indicator does not contain text in the expected format.',
    );
  });
});
