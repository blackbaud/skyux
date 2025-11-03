import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyFileAttachmentHarness,
  provideSkyFileAttachmentTesting,
} from '@skyux/forms/testing';

import { FormsFileAttachmentBasicExampleComponent } from './example.component';

describe('Basic file attachment example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyFileAttachmentHarness;
    fixture: ComponentFixture<FormsFileAttachmentBasicExampleComponent>;
  }> {
    TestBed.configureTestingModule({
      providers: [provideSkyFileAttachmentTesting()],
    });
    const fixture = TestBed.createComponent(
      FormsFileAttachmentBasicExampleComponent,
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyFileAttachmentHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    return { harness, fixture };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsFileAttachmentBasicExampleComponent, NoopAnimationsModule],
    });
  });

  it('should set initial values', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'birth-certificate',
    });

    await expectAsync(harness.getLabelText()).toBeResolvedTo(
      'Birth certificate',
    );
    await expectAsync(harness.getHintText()).toBeResolvedTo(
      'Attach a .pdf, .gif, .png, or .jpeg file.',
    );
    await expectAsync(harness.getAcceptedTypes()).toBeResolvedTo(
      'application/pdf,image/jpeg,image/png,image/gif',
    );
    await expectAsync(harness.isRequired()).toBeResolvedTo(true);

    await harness.clickHelpInline();

    await expectAsync(harness.getHelpPopoverTitle()).toBeResolvedTo(
      'Requirements',
    );
  });

  it('should throw an error if file begins with the letter a', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'birth-certificate',
    });

    const file = new File([], 'art.png', { type: 'image/png' });
    await harness.attachFile(file);

    await expectAsync(
      harness.hasCustomError('invalidStartingLetter'),
    ).toBeResolvedTo(true);
  });

  it('should set custom form error details', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'birth-certificate',
    });

    const file = new File([], 'art.png', { type: 'image/png' });
    await harness.attachFile(file);

    const customFormError = await harness.getCustomError(
      'invalidStartingLetter',
    );

    await expectAsync(customFormError.getErrorText()).toBeResolvedTo(
      "You may not upload a file that begins with the letter 'a'.",
    );
  });
});
