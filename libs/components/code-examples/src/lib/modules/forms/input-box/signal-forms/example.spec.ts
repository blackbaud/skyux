import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { FormsInputBoxSignalFormsExample } from './example';

describe('Signal forms input box example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    fixture: ComponentFixture<FormsInputBoxSignalFormsExample>;
    inputBoxHarness: SkyInputBoxHarness;
  }> {
    const fixture = TestBed.createComponent(FormsInputBoxSignalFormsExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { fixture, inputBoxHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsInputBoxSignalFormsExample],
    });
  });

  describe('first name field', () => {
    it('should have the expected label text and stacked values', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-first-name',
      });

      fixture.detectChanges();

      await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo(
        'First name',
      );

      await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(true);
    });
  });

  describe('last name field', () => {
    it('should have last name required', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-last-name',
      });

      fixture.detectChanges();

      const inputEl = await inputBoxHarness.querySelector(
        '.last-name-input-box',
      );

      await inputEl.setInputValue('');
      await inputEl.blur();

      await expectAsync(inputBoxHarness.hasRequiredError()).toBeResolvedTo(
        true,
      );
    });
  });

  describe('bio field', () => {
    it('should have a character limit of 250', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      fixture.detectChanges();

      const characterCounter = await inputBoxHarness.getCharacterCounter();

      await expectAsync(characterCounter.getCharacterCount()).toBeResolvedTo(0);
      await expectAsync(
        characterCounter.getCharacterCountLimit(),
      ).toBeResolvedTo(250);
    });

    it('should show hint text', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      fixture.detectChanges();

      await expectAsync(inputBoxHarness.getHintText()).toBeResolvedTo(
        `A brief description of the member's background, such as hometown, school, hobbies, etc.`,
      );
    });
  });

  describe('email field', () => {
    it('should require a valid email address', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-email',
      });

      fixture.detectChanges();

      const inputEl = await inputBoxHarness.querySelector('input');

      await inputEl.setInputValue('not-an-email');
      // Native inputs only notify [formField] of value changes via the
      // "input" event; setInputValue only sets the DOM value directly.
      await inputEl.dispatchEvent('input');
      await inputEl.blur();
      fixture.detectChanges();

      await expectAsync(inputBoxHarness.hasEmailError()).toBeResolvedTo(true);
    });
  });

  describe('favorite color field', () => {
    it('should not allow invalid color to be selected', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-favorite-color',
      });

      fixture.detectChanges();

      const selectEl = await inputBoxHarness.querySelector('select');

      // Select the "invalid" option. Native <select> elements only dispatch
      // an "input" event (not "change") to notify [formField] of the update.
      await selectEl.selectOptions(7);
      await selectEl.dispatchEvent('input');
      await selectEl.blur();
      fixture.detectChanges();

      await expectAsync(
        inputBoxHarness.hasCustomFormError('invalidColor'),
      ).toBeResolvedTo(true);
    });
  });
});
