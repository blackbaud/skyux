import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyFileItem, SkyFileLink } from '@skyux/forms';
import {
  SkyFileDropHarness,
  SkyFileItemHarness,
  provideSkyFileAttachmentTesting,
} from '@skyux/forms/testing';

import { FormsFileDropBasicExampleComponent } from './example.component';

describe('Basic file drop example', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyFileDropHarness;
    formControl: FormControl<(SkyFileItem | SkyFileLink)[] | null | undefined>;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      providers: [provideSkyFileAttachmentTesting()],
    });
    const fixture = TestBed.createComponent(FormsFileDropBasicExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyFileDropHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const formControl = fixture.componentInstance.fileDrop;

    return { harness, formControl, loader };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsFileDropBasicExampleComponent, NoopAnimationsModule],
    });
  });

  it('should set initial values', async () => {
    const { harness } = await setupTest({
      dataSkyId: 'logo-upload',
    });

    await expectAsync(harness.getLabelText()).toBeResolvedTo('Logo image');
    await expectAsync(harness.getAcceptedTypes()).toBeResolvedTo(
      'image/png,image/jpeg',
    );
    await expectAsync(harness.getHintText()).toBeResolvedTo(
      'Upload up to 3 files under 50MB.',
    );
    await expectAsync(harness.isStacked()).toBeResolvedTo(true);

    await expectAsync(harness.getLinkUploadHintText()).toBeResolvedTo(
      'Start with http:// or https://',
    );
  });

  it('should not upload invalid files starting with `a`', async () => {
    const { harness, formControl } = await setupTest({
      dataSkyId: 'logo-upload',
    });

    const filesToUpload: File[] = [
      new File([], 'aWrongFile', { type: 'image/png' }),
      new File([], 'validFile', { type: 'image/png' }),
    ];

    await harness.loadFiles(filesToUpload);

    expect(formControl.value?.length).toBe(1);
    await expectAsync(harness.hasValidateFnError()).toBeResolvedTo(true);
  });

  it('should not allow more than 3 files to be uploaded', async () => {
    const { harness, formControl, loader } = await setupTest({
      dataSkyId: 'logo-upload',
    });

    await harness.loadFiles([
      new File([], 'validFile1', { type: 'image/png' }),
      new File([], 'validFile2', { type: 'image/png' }),
      new File([], 'validFile3', { type: 'image/png' }),
    ]);

    expect(formControl.value?.length).toBe(3);
    await expectAsync(
      harness.hasCustomError('maxNumberOfFilesReached'),
    ).toBeResolvedTo(false);
    expect(formControl.valid).toBe(true);

    await harness.enterLinkUploadText('foo.bar');
    await harness.clickLinkUploadDoneButton();

    expect(formControl.value?.length).toBe(4);
    await expectAsync(
      harness.hasCustomError('maxNumberOfFilesReached'),
    ).toBeResolvedTo(true);
    expect(formControl.valid).toBe(false);

    const validFileItemHarness = await loader.getHarness(
      SkyFileItemHarness.with({ fileName: 'validFile2' }),
    );
    await validFileItemHarness.clickDeleteButton();

    expect(formControl.value?.length).toBe(3);
    expect(formControl.valid).toBe(true);
  });
});
