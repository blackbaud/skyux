import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';

import { SkyCheckboxHarness } from './checkbox-harness';
import { CheckboxHarnessTestComponent } from './fixtures/checkbox-harness-test.component';
import { CheckboxHarnessTestModule } from './fixtures/checkbox-harness-test.module';

async function setupTest(options: { dataSkyId?: string } = {}) {
  await TestBed.configureTestingModule({
    imports: [CheckboxHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(CheckboxHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const checkboxHarness: SkyCheckboxHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyCheckboxHarness.with({
          dataSkyId: options.dataSkyId,
        })
      )
    : await loader.getHarness(SkyCheckboxHarness);

  return { checkboxHarness, fixture, loader };
}

describe('Checkbox harness', () => {
  it('should check and uncheck the checkbox', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(false);

    await checkboxHarness.check();
    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(true);

    await checkboxHarness.uncheck();
    await expectAsync(checkboxHarness.isChecked()).toBeResolvedTo(false);
  });

  it('should check if checkbox is disabled', async () => {
    const { checkboxHarness, fixture } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disableForm();
    await expectAsync(checkboxHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should check if checkbox is required', async () => {
    const { checkboxHarness, loader } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isRequired()).toBeResolvedTo(false);

    const phoneCheckboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({
        dataSkyId: 'my-phone-checkbox',
      })
    );
    await expectAsync(phoneCheckboxHarness.isRequired()).toBeResolvedTo(true);
  });

  it('should focus the checkbox', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.isFocused()).toBeResolvedTo(false);

    await checkboxHarness.focus();
    await expectAsync(checkboxHarness.isFocused()).toBeResolvedTo(true);

    await checkboxHarness.blur();
    await expectAsync(checkboxHarness.isFocused()).toBeResolvedTo(false);
  });

  it('should get ARIA attributes', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.getAriaLabel()).toBeResolvedTo(
      'Your email address'
    );
    await expectAsync(checkboxHarness.getAriaLabelledby()).toBeResolvedTo(
      'foo-email-id'
    );
    await expectAsync(checkboxHarness.getLabelText()).toBeResolvedTo('Email');
  });

  it('should get the checkbox name and value', async () => {
    const { checkboxHarness } = await setupTest({
      dataSkyId: 'my-email-checkbox',
    });

    await expectAsync(checkboxHarness.getName()).toBeResolvedTo(
      jasmine.stringMatching(/sky-checkbox-[0-9]+/)
    );
    await expectAsync(checkboxHarness.getValue()).toBeResolvedTo('on');
  });
});
