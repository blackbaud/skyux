import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { FormsInputBoxCharacterLimitExample } from './example';

describe('Input box character limit example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    fixture: ComponentFixture<FormsInputBoxCharacterLimitExample>;
    inputBoxHarness: SkyInputBoxHarness;
  }> {
    const fixture = TestBed.createComponent(FormsInputBoxCharacterLimitExample);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { fixture, inputBoxHarness };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsInputBoxCharacterLimitExample],
    });
  });

  describe('nickname field', () => {
    it('should have the expected label and character limit', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-nickname',
      });

      fixture.detectChanges();

      await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo(
        'Nickname',
      );

      await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(true);
      await expectAsync(inputBoxHarness.getCharacterLimit()).toBeResolvedTo(25);
    });

    it('should count the characters in the initial value', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-nickname',
      });

      fixture.detectChanges();

      await expectAsync(inputBoxHarness.getCharacterCount()).toBeResolvedTo(5);
      await expectAsync(inputBoxHarness.isOverCharacterLimit()).toBeResolvedTo(
        false,
      );
    });

    it('should update the count as the value changes', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-nickname',
      });

      fixture.detectChanges();

      const inputEl = await inputBoxHarness.querySelector('input');
      await inputEl.setInputValue('Kel');
      await inputEl.dispatchEvent('input');

      await expectAsync(inputBoxHarness.getCharacterCount()).toBeResolvedTo(3);
      await expectAsync(inputBoxHarness.isOverCharacterLimit()).toBeResolvedTo(
        false,
      );
    });

    it('should indicate when the value exceeds the limit', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-nickname',
      });

      fixture.detectChanges();

      const inputEl = await inputBoxHarness.querySelector('input');

      await inputEl.setInputValue('K'.repeat(26));
      await inputEl.dispatchEvent('input');
      await inputEl.blur();

      await expectAsync(inputBoxHarness.getCharacterCount()).toBeResolvedTo(26);
      await expectAsync(inputBoxHarness.isOverCharacterLimit()).toBeResolvedTo(
        true,
      );

      await expectAsync(inputBoxHarness.hasMaxLengthError()).toBeResolvedTo(
        true,
      );
    });
  });

  describe('bio field', () => {
    it('should have the expected label, hint text, and character limit', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      fixture.detectChanges();

      await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo('Bio');
      await expectAsync(inputBoxHarness.getHintText()).toBeResolvedTo(
        "A short description that appears on the member's profile.",
      );

      await expectAsync(inputBoxHarness.getCharacterLimit()).toBeResolvedTo(
        100,
      );
    });

    it('should count the characters in a textarea', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-bio',
      });

      fixture.detectChanges();

      await expectAsync(inputBoxHarness.getCharacterCount()).toBeResolvedTo(54);

      const textareaEl = await inputBoxHarness.querySelector('textarea');
      await textareaEl.setInputValue('Volunteer coordinator.');
      await textareaEl.dispatchEvent('input');

      await expectAsync(inputBoxHarness.getCharacterCount()).toBeResolvedTo(22);
    });
  });
});
