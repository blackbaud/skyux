import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyFileAttachmentModule, SkyFileItem } from '@skyux/forms';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyFileAttachmentHarness } from './file-attachment-harness';

//#region Test component
@Component({
  standalone: true,
  imports: [SkyFileAttachmentModule, FormsModule, ReactiveFormsModule],
  template: `
    <sky-file-attachment
      acceptedTypesErrorMessage="Upload a valid file."
      [acceptedTypes]="acceptedTypes"
      [disabled]="disabled"
      [helpPopoverContent]="helpPopoverContent"
      [helpPopoverTitle]="helpPopoverTitle"
      [hintText]="hintText"
      [labelText]="labelText"
      [required]="required"
      [stacked]="stacked"
    />
    <form [formGroup]="formGroup">
      <sky-file-attachment
        acceptedTypes="text/plain"
        data-sky-id="reactive-file-attachment"
        formControlName="attachment"
        labelText="other file attachment"
        (fileClick)="onFileClick()"
      >
        @if (showCustomError) {
          <sky-form-error
            errorName="customError"
            errorText="This is a custom error"
          />
        }
      </sky-file-attachment>
    </form>
  `,
})
class TestComponent {
  public acceptedTypes: string | undefined;
  public attachment: FormControl<SkyFileItem | null | undefined>;
  public disabled = false;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public formGroup: FormGroup<{
    attachment: FormControl<SkyFileItem | null | undefined>;
  }>;
  public labelText: string | undefined;
  public required = false;
  public showCustomError = false;
  public stacked = false;

  constructor(formBuilder: FormBuilder) {
    this.attachment = new FormControl(undefined);

    this.formGroup = formBuilder.group({
      attachment: this.attachment,
    });
  }

  public onFileClick(): void {
    // Only exists for the spy
  }
}
//#endregion Test component

fdescribe('File attachment harness', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  async function setupTest(options: {
    dataSkyId?: string;
    theme?: 'default' | 'modern';
  }): Promise<{
    fileAttachmentHarness: SkyFileAttachmentHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets[options?.theme || 'default'],
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    await TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const fileAttachmentHarness: SkyFileAttachmentHarness = options.dataSkyId
      ? await loader.getHarness(
          SkyFileAttachmentHarness.with({ dataSkyId: options.dataSkyId }),
        )
      : await loader.getHarness(SkyFileAttachmentHarness);

    return { fileAttachmentHarness, fixture };
  }

  it('should get file attachment by its data-sky-id', async () => {
    const { fileAttachmentHarness } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
    });

    await expectAsync(fileAttachmentHarness.getLabelText()).toBeResolvedTo(
      'other file attachment',
    );
  });

  it('should get label text', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    fixture.componentInstance.labelText = 'test harness attachment';
    fixture.detectChanges();

    await expectAsync(fileAttachmentHarness.getLabelText()).toBeResolvedTo(
      fixture.componentInstance.labelText,
    );
  });

  it('should get accepted types', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    await expectAsync(fileAttachmentHarness.getAcceptedTypes()).toBeResolvedTo(
      null,
    );

    fixture.componentInstance.acceptedTypes =
      'application/pdf,image/jpeg,image/png,image/gif';
    fixture.detectChanges();

    await expectAsync(fileAttachmentHarness.getAcceptedTypes()).toBeResolvedTo(
      fixture.componentInstance.acceptedTypes,
    );
  });

  it('should get whether component is disabled', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    await expectAsync(fileAttachmentHarness.isDisabled()).toBeResolvedTo(false);

    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    await expectAsync(fileAttachmentHarness.isDisabled()).toBeResolvedTo(true);
  });

  it('should throw an error if there is no help inline', async () => {
    const { fileAttachmentHarness } = await setupTest({});

    await expectAsync(
      fileAttachmentHarness.clickHelpInline(),
    ).toBeRejectedWithError('No help inline found.');
  });

  it('should click help inline', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    fixture.componentInstance.labelText = 'file attachment';
    fixture.componentInstance.helpPopoverContent = 'Attach a file.';
    fixture.detectChanges();

    await fileAttachmentHarness.clickHelpInline();

    await expectAsync(
      fileAttachmentHarness.getHelpPopoverContent(),
    ).toBeResolved();
  });

  it('should get help popover content', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    fixture.componentInstance.labelText = 'file attachment';
    fixture.componentInstance.helpPopoverContent = 'Attach a file.';
    fixture.detectChanges();

    await fileAttachmentHarness.clickHelpInline();

    await expectAsync(
      fileAttachmentHarness.getHelpPopoverContent(),
    ).toBeResolvedTo(fixture.componentInstance.helpPopoverContent);
  });

  it('should get help popover title', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    fixture.componentInstance.labelText = 'file attachment';
    fixture.componentInstance.helpPopoverContent = 'Attach a file.';
    fixture.componentInstance.helpPopoverTitle = 'What to do.';
    fixture.detectChanges();

    await fileAttachmentHarness.clickHelpInline();

    await expectAsync(
      fileAttachmentHarness.getHelpPopoverTitle(),
    ).toBeResolvedTo(fixture.componentInstance.helpPopoverTitle);
  });

  it('should get hint text', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    fixture.componentInstance.hintText =
      'Attach a .pdf, .gif, .png, or .jpeg file.';
    fixture.detectChanges();

    await expectAsync(fileAttachmentHarness.getHintText()).toBeResolvedTo(
      fixture.componentInstance.hintText,
    );
  });

  it('should get whether file attachment is required', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    fixture.componentInstance.labelText = 'file attachment';
    fixture.detectChanges();

    await expectAsync(fileAttachmentHarness.isRequired()).toBeResolvedTo(false);

    fixture.componentInstance.required = true;
    fixture.detectChanges();

    await expectAsync(fileAttachmentHarness.isRequired()).toBeResolvedTo(true);
  });

  it('should get whether file attachment has stacked enabled', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});

    await expectAsync(fileAttachmentHarness.isStacked()).toBeResolvedTo(false);

    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    await expectAsync(fileAttachmentHarness.isStacked()).toBeResolvedTo(true);
  });

  it('should click the attach file button', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({});
    const input = fixture.nativeElement.querySelectorAll('input')[0];
    spyOn(input, 'click');

    await fileAttachmentHarness.clickAttachFileButton();
    expect(input.click).toHaveBeenCalled();
  });

  it('should throw an error when trying to click the attach file button if there is already a file attached', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
      theme: 'modern',
    });

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.formGroup.controls['attachment'].setValue({
      file,
      url: 'foo.bar',
    });
    fixture.detectChanges();

    await expectAsync(
      fileAttachmentHarness.clickAttachFileButton(),
    ).toBeRejectedWithError(
      'Cannot click Attach file button, there is currently a file attached.',
    );
  });

  it('should throw an error when trying to click the attach file button if there is already a file attached in default theme', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
      theme: 'default',
    });

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.formGroup.controls['attachment'].setValue({
      file,
      url: 'foo.bar',
    });
    fixture.detectChanges();

    await expectAsync(
      fileAttachmentHarness.clickAttachFileButton(),
    ).toBeRejectedWithError(
      'Cannot click Attach file button, there is currently a file attached.',
    );
  });

  it('should click the replace file button', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
      theme: 'default',
    });
    const input = fixture.nativeElement.querySelectorAll('input')[1];
    spyOn(input, 'click');

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.formGroup.controls['attachment'].setValue({
      file,
      url: 'foo.bar',
    });
    fixture.detectChanges();

    await fileAttachmentHarness.clickReplaceFileButton();
    expect(input.click).toHaveBeenCalled();
  });

  it('should throw an error if trying to click replace file button in modern theme', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
      theme: 'modern',
    });

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.formGroup.controls['attachment'].setValue({
      file,
      url: 'foo.bar',
    });
    fixture.detectChanges();

    await expectAsync(
      fileAttachmentHarness.clickReplaceFileButton(),
    ).toBeRejectedWithError(
      'Cannot click Replace file button, it is not visible.',
    );
  });

  it('should throw an error if trying to click replace file button when there is no file attached', async () => {
    const { fileAttachmentHarness } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
      theme: 'modern',
    });

    await expectAsync(
      fileAttachmentHarness.clickReplaceFileButton(),
    ).toBeRejectedWithError(
      'Cannot click Replace file button, it is not visible.',
    );
  });

  it('should click the uploaded file', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
    });

    const spy = spyOn(fixture.componentInstance, 'onFileClick');

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.formGroup.controls['attachment'].setValue({
      file,
      url: 'foo.bar',
    });
    fixture.detectChanges();

    await fileAttachmentHarness.clickUploadedFile();
    expect(spy).toHaveBeenCalled();
  });

  it('should throw an error if attempting to click a file when no file is uploaded', async () => {
    const { fileAttachmentHarness } = await setupTest({});
    await expectAsync(
      fileAttachmentHarness.clickUploadedFile(),
    ).toBeRejectedWithError('Unable to find uploaded file.');
  });

  it('should delete the uploaded file after the delete button is clicked', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
    });

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.formGroup.controls['attachment'].setValue({
      file,
      url: 'foo.bar',
    });
    fixture.detectChanges();

    expect(
      fixture.componentInstance.formGroup.controls['attachment'].value,
    ).toEqual({
      file,
      url: 'foo.bar',
    });

    await fileAttachmentHarness.clickUploadedFileDeleteButton();

    expect(
      fixture.componentInstance.formGroup.controls['attachment'].value,
    ).toEqual(undefined);
  });

  it('should throw an error when attempting to click the delete button when no file is uploaded', async () => {
    const { fileAttachmentHarness } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
    });

    await expectAsync(
      fileAttachmentHarness.clickUploadedFileDeleteButton(),
    ).toBeRejectedWithError(
      "Unable to find uploaded file's delete button. Check if a file is uploaded.",
    );
  });

  it('should get whether custom error has fired', async () => {
    const { fileAttachmentHarness, fixture } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
    });

    fixture.componentInstance.attachment.markAsTouched();
    fixture.componentInstance.showCustomError = true;
    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.formGroup.controls['attachment'].setValue({
      file,
      url: 'foo.bar',
    });
    fixture.detectChanges();

    await expectAsync(
      fileAttachmentHarness.hasCustomError('customError'),
    ).toBeResolvedTo(true);

    /**
     * NOTES TO JW
     * Ran into issues with the above code where having just line 441 and 442 alone would fail because `.markAsTouched`
     * was not setting the control to touched. My best guess from googling is that for controlValueAccessors
     * mark as touched calls the blur function and we do not set that up for file attachment. im not sure if that
     * was deliberate or not. its on my todo list of things to try.
     *
     * This test does pass when i call `.setValue`. im guessing bc there is a markForCheck call in the `set value` function
     * in file attachment on line 626. This is when I thought of just adding a `setValue` function in our harness like
     * file drop has the drop function.
     */
  });

  fit('should get whether max file size error has fired', async () => {
    const { fileAttachmentHarness } = await setupTest({
      dataSkyId: 'reactive-file-attachment',
    });

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    const fileItem: SkyFileItem = {
      file: file,
      url: 'foo.bar',
    };
    await fileAttachmentHarness.setValue(fileItem);

    await expectAsync(fileAttachmentHarness.hasFileTypeError()).toBeResolvedTo(
      true,
    );
  });
});
