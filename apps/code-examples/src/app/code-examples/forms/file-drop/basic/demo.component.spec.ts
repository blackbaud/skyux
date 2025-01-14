import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyFileDropHarness,
  provideSkyFileAttachmentTesting,
} from '@skyux/forms/testing';

import { DemoComponent } from './demo.component';

describe('Basic file drop demo', () => {
  async function setupTest(options: { dataSkyId: string }): Promise<{
    harness: SkyFileDropHarness;
    fixture: ComponentFixture<DemoComponent>;
    formControl: FormControl;
  }> {
    TestBed.configureTestingModule({
      providers: [provideSkyFileAttachmentTesting()],
    });
    const fixture = TestBed.createComponent(DemoComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);

    const harness = await loader.getHarness(
      SkyFileDropHarness.with({ dataSkyId: options.dataSkyId }),
    );

    fixture.detectChanges();
    await fixture.whenStable();

    const formControl = fixture.componentInstance.fileDrop;

    return { harness, fixture, formControl };
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DemoComponent, NoopAnimationsModule],
    });
  });

  it('shoudl set initial values', async () => {
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

    const linkUploadHarness = await harness.getUploadLink();

    await expectAsync(linkUploadHarness.getHintText()).toBeResolvedTo(
      'Start with http:// or https://',
    );
  });

  it('should not upload invalid files starting with `a`', async () => {
    const { harness, formControl } = await setupTest({
      dataSkyId: 'logo-upload',
    });

    const filesToUpload: File[] = [
      new File([], 'aWrongFile.png', { type: 'image/png' }),
      new File([], 'validFile.png', { type: 'image/png' }),
    ];

    await harness.uploadFiles(filesToUpload);

    expect(formControl.value?.length).toBe(1);
    await expectAsync(harness.hasValidateFnError()).toBeResolvedTo(true);
  });

  it('should not allow more than 3 files to be uploaded', async () => {
    const { fixture, harness, formControl } = await setupTest({
      dataSkyId: 'logo-upload',
    });

    await harness.uploadFiles([
      new File([], 'validFile.png', { type: 'image/png' }),
      new File([], 'validFile.png', { type: 'image/png' }),
      new File([], 'validFile.png', { type: 'image/png' }),
    ]);

    expect(formControl.value?.length).toBe(3);
    await expectAsync(
      harness.hasCustomError('maxNumberOfFilesReached'),
    ).toBeResolvedTo(false);
    expect(formControl.valid).toBe(true);

    await harness.uploadLink('link.to.upload');
    expect(formControl.value?.length).toBe(4);
    await expectAsync(
      harness.hasCustomError('maxNumberOfFilesReached'),
    ).toBeResolvedTo(true);
    expect(formControl.valid).toBe(false);

    formControl.value?.splice(2, 1);
    formControl.updateValueAndValidity();
    fixture.detectChanges();

    expect(formControl.value?.length).toBe(3);
    expect(formControl.valid).toBe(true);
  });
});
