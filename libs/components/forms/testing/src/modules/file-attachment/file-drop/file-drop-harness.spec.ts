import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyFileDropChange, SkyFileDropModule } from '@skyux/forms';

import { ReplaySubject, firstValueFrom } from 'rxjs';

import { SkyFileDropHarness } from './file-drop-harness';

@Component({
  imports: [SkyFileDropModule],
  template: `<sky-file-drop
    data-sky-id="test-file-drop"
    (filesChanged)="onFilesChanged($event)"
  />`,
})
class TestComponent {
  public filesChanged = new ReplaySubject<SkyFileDropChange>(1);

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
