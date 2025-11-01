import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, inject } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideSkyFileReaderTesting } from '@skyux/core/testing';
import {
  SkyFileDropModule,
  SkyFileItem,
  SkyFileLink,
  SkyFileValidateFn,
} from '@skyux/forms';

import { SkyFileDropHarness } from './file-drop-harness';
import { SkyFileItemHarness } from './file-item-harness';

@Component({
  imports: [SkyFileDropModule, FormsModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="formGroup">
      <sky-file-drop
        data-sky-id="test-file-drop"
        formControlName="fileDrop"
        [acceptedTypes]="acceptedTypes"
        [allowLinks]="allowLinks"
        [fileUploadAriaLabel]="fileUploadAriaLabel"
        [helpPopoverContent]="helpPopoverContent"
        [helpPopoverTitle]="helpPopoverTitle"
        [hintText]="hintText"
        [labelHidden]="labelHidden"
        [labelText]="labelText"
        [linkUploadAriaLabel]="linkUploadAriaLabel"
        [linkUploadHintText]="linkUploadHintText"
        [maxFileSize]="maxFileSize"
        [minFileSize]="minFileSize"
        [required]="required"
        [stacked]="stacked"
        [validateFn]="validateFunction"
      >
        @if (showCustomError) {
          <sky-form-error
            errorName="customError"
            errorText="This is a custom error."
          />
        }
      </sky-file-drop>
    </form>
    @for (file of fileDrop.value; track file) {
      <sky-file-item [fileItem]="file" (deleteFile)="deleteFile($event)" />
    }
  `,
})
class TestComponent {
  public acceptedTypes: string | undefined;
  public allItems: (SkyFileItem | SkyFileLink)[] = [];
  public allowLinks = true;
  public fileUploadAriaLabel: string | undefined;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public labelHidden = false;
  public labelText: string | undefined = 'File upload';
  public linkUploadAriaLabel: string | undefined;
  public linkUploadHintText: string | undefined;
  public maxFileSize: number | undefined;
  public minFileSize: number | undefined;
  public required = false;
  public showCustomError = false;
  public stacked = false;
  public validateFunction: SkyFileValidateFn | undefined;

  public fileDrop: FormControl = new FormControl(undefined);
  public formGroup: FormGroup = inject(FormBuilder).group({
    fileDrop: this.fileDrop,
  });

  public deleteFile(file: SkyFileItem | SkyFileLink): void {
    const index = this.fileDrop.value.indexOf(file);
    if (index !== -1) {
      this.fileDrop.value?.splice(index, 1);
    }
    if (this.fileDrop.value.length === 0) {
      this.fileDrop.setValue(null);
    }
  }
}

describe('File drop harness', () => {
  async function setupTest(): Promise<{
    harness: SkyFileDropHarness;
    fixture: ComponentFixture<TestComponent>;
    loader: HarnessLoader;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
      providers: [provideSkyFileReaderTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness: SkyFileDropHarness = await loader.getHarness(
      SkyFileDropHarness.with({
        dataSkyId: 'test-file-drop',
      }),
    );

    return { harness, fixture, loader };
  }

  it('should drop a single file', async () => {
    const { fixture, harness } = await setupTest();

    const testFile = new File([], 'test.png');

    await harness.loadFile(testFile);

    expect(fixture.componentInstance.fileDrop.value).toEqual([
      {
        file: testFile,
        url: jasmine.any(String),
      },
    ]);
  });

  it('should get accepted types', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.acceptedTypes = 'image/png';
    fixture.detectChanges();

    await expectAsync(harness.getAcceptedTypes()).toBeResolvedTo('image/png');
  });

  it('should get file upload button aria-label', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.fileUploadAriaLabel =
      'this is an accessibility label.';
    fixture.detectChanges();

    await expectAsync(harness.getFileUploadAriaLabel()).toBeResolvedTo(
      'this is an accessibility label.',
    );
  });

  it('should click the file upload button', async () => {
    const { fixture, harness } = await setupTest();

    const input = fixture.nativeElement.querySelector(
      'input.sky-file-input-hidden',
    );
    spyOn(input, 'click');

    await harness.clickFileDropTarget();
    expect(input.click).toHaveBeenCalled();
  });

  it('should throw an error if there is no help inline', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHelpPopoverContent()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  it('should get help popover content', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.helpPopoverContent = 'Upload a file';
    fixture.detectChanges();

    await harness.clickHelpInline();

    await expectAsync(harness.getHelpPopoverContent()).toBeResolvedTo(
      'Upload a file',
    );
  });

  it('should get help popover title', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.helpPopoverContent = 'Upload a file';
    fixture.componentInstance.helpPopoverTitle = 'Help';
    fixture.detectChanges();

    await harness.clickHelpInline();

    await expectAsync(harness.getHelpPopoverTitle()).toBeResolvedTo('Help');
  });

  it('should get hint text', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.hintText = 'this is a hint.';
    fixture.detectChanges();

    await expectAsync(harness.getHintText()).toBeResolvedTo('this is a hint.');
  });

  it('should get label text', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getLabelText()).toBeResolvedTo('File upload');
  });

  it('should get whether the label is hidden', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.isLabelHidden()).toBeResolvedTo(false);

    fixture.componentInstance.labelHidden = true;
    fixture.detectChanges();

    await expectAsync(harness.isLabelHidden()).toBeResolvedTo(true);
  });

  it('should get whether file drop is required', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.isRequired()).toBeResolvedTo(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    await expectAsync(harness.isRequired()).toBeResolvedTo(true);
  });

  it('should get whether file drop is stacked', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.isStacked()).toBeResolvedTo(false);

    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    await expectAsync(harness.isStacked()).toBeResolvedTo(true);
  });

  it('should get whether required error has fired', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    fixture.componentInstance.fileDrop.markAsTouched();
    fixture.detectChanges();

    await expectAsync(harness.hasRequiredError()).toBeResolvedTo(true);
  });

  it('should get whether file type error has fired', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.acceptedTypes = 'image/png';
    fixture.detectChanges();

    await harness.loadFiles([
      new File([], 'wrongFile.jpg', { type: 'image/jpg' }),
    ]);

    await expectAsync(harness.hasFileTypeError()).toBeResolvedTo(true);
  });

  it('should get whether max file type error has fired', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.maxFileSize = -1;
    fixture.detectChanges();

    await harness.loadFiles([
      new File([], 'wrongFile.jpg', { type: 'image/jpg' }),
    ]);

    await expectAsync(harness.hasMaxFileSizeError()).toBeResolvedTo(true);
  });

  it('should get whether min file type error has fired', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.minFileSize = 1000;
    fixture.detectChanges();

    await harness.loadFiles([
      new File([], 'wrongFile.jpg', { type: 'image/jpg' }),
    ]);

    await expectAsync(harness.hasMinFileSizeError()).toBeResolvedTo(true);
  });

  it('should get whether validate file type error has fired', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.validateFunction = function (
      file: SkyFileItem,
    ): string | undefined {
      return file.file.name.startsWith('a')
        ? 'Upload a file that does not begin with the letter "a"'
        : undefined;
    };
    fixture.detectChanges();

    await harness.loadFiles([
      new File([], 'aWrongFile.jpg', { type: 'image/jpg' }),
    ]);

    await expectAsync(harness.hasValidateFnError()).toBeResolvedTo(true);
  });

  it('should get whether custom error has fired', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.fileDrop.markAsTouched();
    fixture.detectChanges();
    fixture.componentInstance.showCustomError = true;
    fixture.detectChanges();

    await expectAsync(harness.hasCustomError('customError')).toBeResolvedTo(
      true,
    );
  });

  describe('upload link harness', () => {
    it('should get upload link aria-label', async () => {
      const { fixture, harness } = await setupTest();

      fixture.componentInstance.linkUploadAriaLabel = 'upload aria-label';
      fixture.detectChanges();

      await expectAsync(harness.getLinkUploadAriaLabel()).toBeResolvedTo(
        'upload aria-label',
      );
    });

    it('should get the upload link hint text', async () => {
      const { fixture, harness } = await setupTest();

      fixture.componentInstance.linkUploadHintText = 'link hint text';
      fixture.detectChanges();

      await expectAsync(harness.getLinkUploadHintText()).toBeResolvedTo(
        'link hint text',
      );
    });

    it('should throw an error clicking a disabled upload link button', async () => {
      const { harness } = await setupTest();

      await expectAsync(
        harness.clickLinkUploadDoneButton(),
      ).toBeRejectedWithError(
        'Done button is disabled and cannot be clicked. Enter text to enable link upload.',
      );
    });

    it('should throw an error if attempting to interact with link upload when links are not allowed', async () => {
      const { fixture, harness } = await setupTest();

      fixture.componentInstance.allowLinks = false;
      fixture.detectChanges();

      await expectAsync(harness.getLinkUploadAriaLabel()).toBeRejectedWithError(
        'Link upload cannot be found. Set `allowLinks` property to `true`.',
      );
    });

    it('should upload a link', async () => {
      const { fixture, harness } = await setupTest();

      await harness.enterLinkUploadText('foo.bar');
      await harness.clickLinkUploadDoneButton();

      expect(fixture.componentInstance.fileDrop.value).toEqual([
        {
          url: 'foo.bar',
        },
      ]);
    });
  });

  describe('sky file item harness', () => {
    async function getFileItemHarness(
      harness: SkyFileDropHarness,
      loader: HarnessLoader,
    ): Promise<SkyFileItemHarness> {
      await harness.loadFiles([
        new File(['a'.repeat(20)], 'FileName', { type: 'image/png' }),
      ]);
      return await loader.getHarness(SkyFileItemHarness);
    }
    it('should get the file name', async () => {
      const { harness, loader } = await setupTest();

      const fileItemHarness = await getFileItemHarness(harness, loader);

      await expectAsync(fileItemHarness.getFileName()).toBeResolvedTo(
        'FileName',
      );
    });

    it('should get the file size', async () => {
      const { harness, loader } = await setupTest();

      const fileItemHarness = await getFileItemHarness(harness, loader);

      await expectAsync(fileItemHarness.getFileSize()).toBeResolvedTo(
        '20 bytes',
      );
    });

    it('should click the delete button', async () => {
      const { fixture, harness, loader } = await setupTest();

      const fileItemHarness = await getFileItemHarness(harness, loader);

      expect(fixture.componentInstance.fileDrop.value.length).toBe(1);

      await fileItemHarness.clickDeleteButton();

      expect(fixture.componentInstance.fileDrop.value).toBe(null);
    });

    it('should get sky file item by file name', async () => {
      const { harness, loader } = await setupTest();

      await harness.loadFiles([
        new File(['a'.repeat(20)], 'FileName', { type: 'image/png' }),
        new File(['a'.repeat(10)], 'OtherFile', { type: 'image/png' }),
      ]);

      const fileItemHarness = await loader.getHarness(
        SkyFileItemHarness.with({
          fileName: 'OtherFile',
        }),
      );

      await expectAsync(fileItemHarness.getFileSize()).toBeResolvedTo(
        '10 bytes',
      );
    });
  });
});
