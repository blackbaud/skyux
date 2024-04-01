import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkyCheckboxGroupHarness } from './checkbox-group-harness';
import { CheckboxHarnessTestComponent } from './fixtures/checkbox-harness-test.component';
import { CheckboxHarnessTestModule } from './fixtures/checkbox-harness-test.module';

async function setupTest(options: { dataSkyId?: string } = {}): Promise<{
  checkboxGroupHarness: SkyCheckboxGroupHarness;
  fixture: ComponentFixture<CheckboxHarnessTestComponent>;
}> {
  await TestBed.configureTestingModule({
    imports: [CheckboxHarnessTestModule],
  }).compileComponents();

  const fixture = TestBed.createComponent(CheckboxHarnessTestComponent);
  const loader = TestbedHarnessEnvironment.loader(fixture);

  const checkboxGroupHarness: SkyCheckboxGroupHarness = options.dataSkyId
    ? await loader.getHarness(
        SkyCheckboxGroupHarness.with({
          dataSkyId: options.dataSkyId,
        }),
      )
    : await loader.getHarness(SkyCheckboxGroupHarness);

  return { checkboxGroupHarness, fixture };
}

describe('Checkbox group harness', () => {
  it('should get the label text', async () => {
    const { checkboxGroupHarness } = await setupTest();

    await expectAsync(checkboxGroupHarness.getLabelText()).toBeResolvedTo(
      'Contact method',
    );
  });

  it('should get the label text when label text is hidden', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest({
      dataSkyId: 'checkbox-group',
    });

    fixture.componentInstance.hideGroupLabel = true;
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getLabelText()).toBeResolvedTo(
      'Contact method',
    );
  });

  it('should indicate the label is not hidden', async () => {
    const { checkboxGroupHarness } = await setupTest();

    await expectAsync(checkboxGroupHarness.getLabelHidden()).toBeResolvedTo(
      false,
    );
  });

  it('should indicate the label is hidden', async () => {
    const { checkboxGroupHarness, fixture } = await setupTest();

    fixture.componentInstance.hideGroupLabel = true;
    fixture.detectChanges();

    await expectAsync(checkboxGroupHarness.getLabelHidden()).toBeResolvedTo(
      true,
    );
  });

  it('should display an error message when there is a custom validation error', async () => {
    const { checkboxGroupHarness } = await setupTest();
    const checkboxHarness = (await checkboxGroupHarness.getCheckboxes())[0];

    await checkboxHarness.check();
    await checkboxHarness.uncheck();

    await expectAsync(
      checkboxGroupHarness.hasError('contactMethodRequired'),
    ).toBeResolvedTo(true);
  });

  it('should throw an error if no form error is found', async () => {
    const { checkboxGroupHarness } = await setupTest();
    const checkboxHarness = (await checkboxGroupHarness.getCheckboxes())[0];

    await checkboxHarness.check();

    await expectAsync(
      checkboxGroupHarness.hasError('test'),
    ).toBeRejectedWithError('No form errors found.');
  });
});
