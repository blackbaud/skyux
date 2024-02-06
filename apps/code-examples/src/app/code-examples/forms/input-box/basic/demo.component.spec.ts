import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { DemoComponent } from './demo.component';

describe('Basic input box demo', () => {
  async function setupTest(options: {
    dataSkyId: string;
  }): Promise<SkyInputBoxHarness> {
    const fixture = TestBed.createComponent(DemoComponent);

    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return harness;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, DemoComponent],
    });
  });

  describe('first name field', () => {
    it('should have the expected label text and stacked values', async () => {
      const harness = await setupTest({
        dataSkyId: 'input-box-first-name',
      });

      await expectAsync(harness.getLabelText()).toBeResolvedTo('First name');
      await expectAsync(harness.getStacked()).toBeResolvedTo(true);
    });
  });

  describe('last name field', () => {
    it('should have last name required', async () => {
      const harness = await setupTest({
        dataSkyId: 'input-box-last-name',
      });
      const inputEl = document.querySelector(
        'input.last-name-input-box',
      ) as HTMLInputElement;
      inputEl.value = '';
      SkyAppTestUtility.fireDomEvent(inputEl, 'input');
      SkyAppTestUtility.fireDomEvent(inputEl, 'blur');

      await expectAsync(harness.hasRequiredError()).toBeResolvedTo(true);
    });
  });

  describe('bio field', () => {
    it('should have a character limit of 250', async () => {
      const harness = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      const characterCounter = await harness.getCharacterCounter();

      await expectAsync(characterCounter.getCharacterCount()).toBeResolvedTo(0);
      await expectAsync(
        characterCounter.getCharacterCountLimit(),
      ).toBeResolvedTo(250);
    });

    it('should show a help popover with the expected text', async () => {
      const harness = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      const helpPopover = await harness.getHelpPopover();
      await helpPopover.clickPopoverButton();

      const helpPopoverContent = await helpPopover.getPopoverContent();

      await expectAsync(helpPopoverContent.getBodyText()).toBeResolvedTo(
        `A brief description of the member's background, such as hometown, school, hobbies, etc.`,
      );
    });
  });

  describe('favorite color field', () => {
    it('should not allow invalid color to be selected', async () => {
      const harness = await setupTest({
        dataSkyId: 'input-box-favorite-color',
      });

      const selectEl = document.querySelector(
        '.input-box-favorite-color-select',
      ) as HTMLSelectElement;

      selectEl.value = 'invalid';
      selectEl.dispatchEvent(new Event('change'));

      await expectAsync(harness.hasCustomFormError('invalid')).toBeResolvedTo(
        true,
      );
    });
  });
});
