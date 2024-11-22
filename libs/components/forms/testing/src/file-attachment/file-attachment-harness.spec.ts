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
import { SkyFileAttachmentModule } from '@skyux/forms';
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
    >
      @if (showCustomError) {
        <sky-form-error
          errorName="customError"
          errorText="This is a custom error"
        />
      }
    </sky-file-attachment>
    <form [formGroup]="formGroup">
      <sky-file-attachment
        data-sky-id="reactive-file-attachment"
        formControlName="attachment"
        labelText="other file attachment"
      />
    </form>
  `,
})
class TestComponent {
  public acceptedTypes: string | undefined;
  public attachment: FormControl;
  public disabled = false;
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public formGroup: FormGroup;
  public labelText: string | undefined;
  public required = false;
  public stacked = false;

  constructor(formBuilder: FormBuilder) {
    this.attachment = new FormControl('');
    this.formGroup = formBuilder.group({
      attachment: this.attachment,
    });
  }
}
//#endregion Test component

describe('File attachment harness', () => {
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
    fixture.componentInstance.attachment.setValue({ file, url: 'foo.bar' });
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
    fixture.componentInstance.attachment.setValue({ file, url: 'foo.bar' });
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
    const input = fixture.nativeElement.querySelectorAll('input')[0];
    spyOn(input, 'click');

    const file = new File([], 'file.txt', { type: 'text/plain ' });
    fixture.componentInstance.attachment.setValue({ file, url: 'foo.bar' });
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
    fixture.componentInstance.attachment.setValue({ file, url: 'foo.bar' });
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
});
