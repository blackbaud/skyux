import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  SkyFileDropChange,
  SkyFileDropModule,
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
      [fileUploadAriaLabel]="fileUploadAriaLabel"
      [helpPopoverContent]="helpPopoverContent"
      [helpPopoverTitle]="helpPopoverTitle"
      [hintText]="hintText"
      [labelText]="labelText"
      [linkUploadAriaLabel]="linkUploadAriaLabel"
      [linkUploadHintText]="linkUploadHintText"
      [maxFileSize]="maxFileSize"
      [minFileSize]="minFileSize"
      [required]="required"
      [stacked]="stacked"
      [validateFn]="validateFunction"
      (filesChanged)="onFilesChanged($event)"
    />
  `,
})
class TestComponent {
  public acceptedTypes: string | undefined;
  public fileUploadAriaLabel: string | undefined;
  public filesChanged = new ReplaySubject<SkyFileDropChange>(1);
  public helpPopoverContent: string | undefined;
  public helpPopoverTitle: string | undefined;
  public hintText: string | undefined;
  public labelText: string | undefined;
  public linkUploadAriaLabel: string | undefined;
  public linkUploadHintText: string | undefined;
  public maxFileSize: string | undefined;
  public minFileSize: string | undefined;
  public required = false;
  public stacked = false;
  public validateFunction: SkyFileValidateFn | undefined;

  public onFilesChanged(event: SkyFileDropChange): void {
    this.filesChanged.next(event);
  }
}

describe('File drop harness', () => {
  async function setupTest(): Promise<{
    harness: SkyFileDropHarness;
    fixture: ComponentFixture<TestComponent>;
  }> {
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
});
