import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';

import { FormsInputBoxBasicExampleComponent } from './example.component';

describe('Basic input box example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    fixture: ComponentFixture<FormsInputBoxBasicExampleComponent>;
    inputBoxHarness: SkyInputBoxHarness;
    helpController: SkyHelpTestingController;
  }> {
    const fixture = TestBed.createComponent(FormsInputBoxBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const helpController = TestBed.inject(SkyHelpTestingController);

    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: options.dataSkyId }),
    );

    return { fixture, inputBoxHarness, helpController };
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
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-first-name',
      });

      fixture.detectChanges();

      await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo(
        'First name',
      );

      await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(true);
    });

    it('should have the correct help key', async () => {
      const { fixture, inputBoxHarness, helpController } = await setupTest({
        dataSkyId: 'input-box-first-name',
      });

      fixture.detectChanges();

      await inputBoxHarness.clickHelpInline();

      helpController.expectCurrentHelpKey('first-name-help');
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
    it('should show a help popover with the expected text', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-email',
      });

      fixture.detectChanges();

      await inputBoxHarness.clickHelpInline();

      await expectAsync(inputBoxHarness.getHelpPopoverTitle()).toBeResolvedTo(
        'Privacy notice',
      );

      await expectAsync(inputBoxHarness.getHelpPopoverContent()).toBeResolvedTo(
        `We do not share this information with any third parties.`,
      );
    });
  });

  describe('favorite color field', () => {
    it('should not allow invalid color to be selected', async () => {
      const { fixture, inputBoxHarness } = await setupTest({
        dataSkyId: 'input-box-favorite-color',
      });

      fixture.detectChanges();

      const selectEl = await inputBoxHarness.querySelector('select');

      // Select the "invalid" option.
      await selectEl.selectOptions(7);

      await expectAsync(
        inputBoxHarness.hasCustomFormError('invalid'),
      ).toBeResolvedTo(true);
    });
  });
});
