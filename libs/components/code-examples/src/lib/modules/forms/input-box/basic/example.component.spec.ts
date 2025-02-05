import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility } from '@skyux-sdk/testing';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { FormsInputBoxBasicExampleComponent } from './example.component';

describe('Basic input box example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    inputBoxHarness: SkyInputBoxHarness;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(FormsInputBoxBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpController = TestBed.inject(SkyHelpTestingController);
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { inputBoxHarness, helpController };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsInputBoxBasicExampleComponent,
        SkyHelpTestingModule,
      ],
    });
  });

  describe('first name field', () => {
    it('should have the expected label text and stacked values', async () => {
      const { inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-first-name',
      });

      await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo(
        'First name',
      );
      await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(true);
    });

    it('should have the correct help key', async () => {
      const { inputBoxHarness, helpController } = await setupTest({
        dataSkyId: 'input-box-first-name',
      });

      await inputBoxHarness.clickHelpInline();

      helpController.expectCurrentHelpKey('first-name-help');
    });
  });

  describe('last name field', () => {
    it('should have last name required', async () => {
      const { inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-last-name',
      });

      const inputEl = document.querySelector<HTMLInputElement>(
        'input.last-name-input-box',
      );

      if (inputEl) {
        inputEl.value = '';
        SkyAppTestUtility.fireDomEvent(inputEl, 'input');
        SkyAppTestUtility.fireDomEvent(inputEl, 'blur');
      }

      await expectAsync(inputBoxHarness.hasRequiredError()).toBeResolvedTo(
        true,
      );
    });
  });

  describe('bio field', () => {
    it('should have a character limit of 250', async () => {
      const { inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      const characterCounter = await inputBoxHarness.getCharacterCounter();

      await expectAsync(characterCounter.getCharacterCount()).toBeResolvedTo(0);
      await expectAsync(
        characterCounter.getCharacterCountLimit(),
      ).toBeResolvedTo(250);
    });

    it('should show hint text', async () => {
      const { inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      const hintText = await inputBoxHarness.getHintText();

      expect(hintText).toBe(
        `A brief description of the member's background, such as hometown, school, hobbies, etc.`,
      );
    });
  });

  describe('email field', () => {
    it('should show a help popover with the expected text', async () => {
      const { inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-email',
      });

      await inputBoxHarness.clickHelpInline();

      const helpPopoverTitle = await inputBoxHarness.getHelpPopoverTitle();
      expect(helpPopoverTitle).toBe('Privacy notice');

      const helpPopoverContent = await inputBoxHarness.getHelpPopoverContent();
      expect(helpPopoverContent).toBe(
        `We do not share this information with any third parties.`,
      );
    });
  });

  describe('favorite color field', () => {
    it('should not allow invalid color to be selected', async () => {
      const { inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-favorite-color',
      });

      const selectEl = document.querySelector<HTMLSelectElement>(
        '.input-box-favorite-color-select',
      );

      if (selectEl) {
        selectEl.value = 'invalid';
        selectEl.dispatchEvent(new Event('change'));
      }

      await expectAsync(
        inputBoxHarness.hasCustomFormError('invalid'),
      ).toBeResolvedTo(true);
    });
  });
});
