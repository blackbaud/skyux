import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  SkyFileDropChange,
  SkyFileDropModule,
  SkyFileItem,
  SkyFileLink,
  SkyFileValidateFn,
} from '@skyux/forms';

import { ReplaySubject, firstValueFrom } from 'rxjs';

import { SkyFileDropHarness } from './file-drop-harness';

@Component({
  standalone: true,
  imports: [SkyFileDropModule],
  template: `
    <sky-file-drop
      data-sky-id="test-file-drop"
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
      (filesChanged)="onFilesChanged($event)"
      (linkChanged)="onLinkChanged($event)"
    />
    @for (file of allItems; track file) {
      <sky-file-item [fileItem]="file" (deleteFile)="deleteFile($event)" />
    }
  `,
})
class TestComponent {
  public acceptedTypes: string | undefined;
  public allItems: (SkyFileItem | SkyFileLink)[] = [];
  public allowLinks = true;
  public fileUploadAriaLabel: string | undefined;
  public filesChanged = new ReplaySubject<SkyFileDropChange | SkyFileLink>(1);
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public labelHidden = false;
  public labelText: string | undefined = 'File upload';
  public linkUploadAriaLabel: string | undefined;
  public linkUploadHintText: string | undefined;
  public maxFileSize: string | undefined;
  public minFileSize: string | undefined;
  public required = false;
  public stacked = false;
  public validateFunction: SkyFileValidateFn | undefined;

  public onFilesChanged(event: SkyFileDropChange): void {
    this.allItems = this.allItems.concat(event.files);
    this.filesChanged.next(event);
  }

  public onLinkChanged(event: SkyFileDropChange): void {
    this.onFilesChanged(event);
  }

  public deleteFile(file: SkyFileItem | SkyFileLink): void {
    if (file) {
      const index = this.allItems.indexOf(file);
      if (index !== -1) {
        this.allItems.splice(index, 1);
      }
    }
  }
}

fdescribe('File drop harness', () => {
  async function setupTest(): Promise<{
    harness: SkyFileDropHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
    await TestBed.configureTestingModule({
      imports: [TestComponent, NoopAnimationsModule],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness: SkyFileDropHarness = await loader.getHarness(
      SkyFileDropHarness.with({
        dataSkyId: 'test-file-drop',
      }),
    );

    return { harness, fixture };
  }

  it('should drop files', async () => {
    const { fixture, harness } = await setupTest();

    const testFile = new File([], 'test.png');

    const changedFiles = firstValueFrom(fixture.componentInstance.filesChanged);

    await harness.dropFile(testFile);

    const files = await changedFiles;

    expect(files).toEqual({
      files: [
        {
          file: testFile,
          url: jasmine.any(String),
        },
      ],
      rejectedFiles: [],
    });
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

    await harness.clickFileUploadButton();
    expect(input.click).toHaveBeenCalled();
  });

  it('should throw an error if there is no help inline', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getHelpPopoverContent()).toBeRejectedWithError(
      'No help inline found.',
    );
  });

  // it('should get help popover content', async () => {
  //   const { fixture, harness } = await setupTest();

  //   fixture.componentInstance.helpPopoverContent = 'Upload a file';
  //   fixture.detectChanges();

  //   await harness.clickHelpInline();

  //   await expectAsync(harness.getHelpPopoverContent()).toBeResolvedTo(
  //     'Upload a file',
  //   );
  // });

  // it('should get help popover title', async () => {
  //   const { fixture, harness } = await setupTest();

  //   fixture.componentInstance.helpPopoverContent = 'Upload a file';
  //   fixture.componentInstance.helpPopoverTitle = 'Help';
  //   fixture.detectChanges();

  //   await harness.clickHelpInline();

  //   await expectAsync(harness.getHelpPopoverTitle()).toBeResolvedTo('Help');
  // });

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

  it('should get upload link aria-label', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.linkUploadAriaLabel = 'upload aria-label';
    fixture.detectChanges();

    await expectAsync(harness.getUploadLinkAriaLabel()).toBeResolvedTo(
      'upload aria-label',
    );
  });

  it('should get the upload link hint text', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.linkUploadHintText = 'link hint text';
    fixture.detectChanges();

    await expectAsync(harness.getUploadLinkHintText()).toBeResolvedTo(
      'link hint text',
    );
  });

  it('should throw an error clicking a disabled upload link button', async () => {
    const { harness } = await setupTest();

    await expectAsync(
      harness.clickUploadLinkDoneButton(),
    ).toBeRejectedWithError('Done button is disabled and cannot be clicked.');
  });

  it('should load a file', async () => {
    const { fixture, harness } = await setupTest();

    const changedFiles = firstValueFrom(fixture.componentInstance.filesChanged);

    await harness.uploadLink('foo.bar');

    const files = await changedFiles;

    expect(files).toEqual({
      url: 'foo.bar',
    });
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
});
