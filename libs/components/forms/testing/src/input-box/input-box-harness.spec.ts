import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { InputBoxHarnessTestComponent } from './fixtures/input-box-harness-test.component';
import { InputBoxHarnessTestModule } from './fixtures/input-box-harness-test.module';
import { LastNameHarness } from './fixtures/last-name-harness';
import { SkyInputBoxHarness } from './input-box-harness';

const DATA_SKY_ID_EASY_MODE = 'my-input-box-last-name-easy-mode';

describe('Input box harness', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    component: InputBoxHarnessTestComponent;
    fixture: ComponentFixture<InputBoxHarnessTestComponent>;
    inputBoxHarness: SkyInputBoxHarness;
  }> {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, InputBoxHarnessTestModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(InputBoxHarnessTestComponent);
    const component = fixture.componentInstance;
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const inputBoxHarness = await loader.getHarness(
      SkyInputBoxHarness.with({
        dataSkyId: options.dataSkyId,
      })
    );

    return { component, fixture, inputBoxHarness };
  }

  it('should query child harnesses', async () => {
    const { inputBoxHarness } = await setupTest({
      dataSkyId: 'my-input-box-last-name',
    });

    const harness = await inputBoxHarness.queryHarness(LastNameHarness);

    await expectAsync(harness?.value()).toBeResolvedTo('Doe');
  });

  it('should return disabled', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(inputBoxHarness.getDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.easyModeDisabled = true;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getDisabled()).toBeResolvedTo(true);
  });

  it('should return label text', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo(
      'Last name (easy mode)'
    );

    fixture.componentInstance.easyModeLabel = undefined;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getLabelText()).toBeResolvedTo('');
  });

  it('should return help popover harness', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    // String content
    const helpPopover = await inputBoxHarness.getHelpPopover();
    await helpPopover.clickPopoverButton();

    const helpContent = await helpPopover.getPopoverContent();

    await expectAsync(helpContent.getBodyText()).toBeResolvedTo('Help content');
    await expectAsync(helpContent.getTitleText()).toBeResolvedTo('Help title');

    // Template content
    component.easyModeHelpContent = component.helpContentTemplate;
    fixture.detectChanges();

    await expectAsync(helpContent.getBodyText()).toBeResolvedTo(
      'Help content from template'
    );

    // No content
    component.easyModeHelpContent = undefined;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getHelpPopover()).toBeRejectedWithError(
      'The input box does not have a help popover configured.'
    );
  });

  it('should return stacked', async () => {
    const { fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(false);

    fixture.componentInstance.easyModeStacked = true;
    fixture.detectChanges();

    await expectAsync(inputBoxHarness.getStacked()).toBeResolvedTo(true);
  });

  it('should return custom errors', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    const control = component.myForm.controls['lastName'];

    control.addValidators(Validators.required);
    control.setValue('');
    control.markAsDirty();

    fixture.detectChanges();

    const customErrors = await inputBoxHarness.getCustomErrors();

    expect(customErrors.length).toBe(1);

    const customError = customErrors[0];

    await expectAsync(customError.getDescriptionType()).toBeResolvedTo('error');
    await expectAsync(customError.getIndicatorType()).toBeResolvedTo('danger');
    await expectAsync(customError.getText()).toBeResolvedTo('Test error');
  });

  it('should return character counter indicator', async () => {
    const { component, fixture, inputBoxHarness } = await setupTest({
      dataSkyId: DATA_SKY_ID_EASY_MODE,
    });

    await expectAsync(
      inputBoxHarness.getCharacterCounter()
    ).toBeRejectedWithError(
      'The input box does not have a character limit specified.'
    );

    component.easyModeCharacterLimit = 50;
    fixture.detectChanges();

    const characterCounter = await inputBoxHarness.getCharacterCounter();

    await expectAsync(characterCounter.getCharacterCountLimit()).toBeResolvedTo(
      50
    );
  });
});
