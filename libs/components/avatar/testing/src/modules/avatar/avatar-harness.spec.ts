import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component, computed, input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAvatarModule, SkyAvatarSize } from '@skyux/avatar';
import { SkyFileItem } from '@skyux/forms';

import { SkyAvatarHarness } from './avatar-harness';

@Component({
  imports: [SkyAvatarModule],
  template: `<sky-avatar
    data-sky-id="test-avatar"
    [canChange]="canChange()"
    [maxFileSize]="maxFileSize()"
    [name]="name()"
    [src]="srcComputed()"
    [size]="size()"
    (avatarChanged)="onAvatarChanged($event)"
  />`,
})
class TestComponent {
  public updateSrcOnChange = true;

  protected readonly canChange = input<boolean>();
  protected readonly maxFileSize = input<number>();
  protected readonly name = input<string | undefined>();
  protected readonly src = input<string>();
  protected readonly size = input<SkyAvatarSize>();

  protected srcFile = signal<File | undefined>(undefined);
  protected srcComputed = computed(() => this.srcFile() ?? this.src());

  protected onAvatarChanged(file: SkyFileItem): void {
    if (this.updateSrcOnChange) {
      this.srcFile.set(file.file);
    }
  }
}

async function getByteArray(file: File | Blob): Promise<number[]> {
  return Array.from(new Uint8Array(await file.arrayBuffer()));
}

describe('Avatar harness', () => {
  async function setupTest(): Promise<{
    fixture: ComponentFixture<TestComponent>;
    harness: SkyAvatarHarness;
  }> {
    const fixture = TestBed.createComponent(TestComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness: SkyAvatarHarness = await loader.getHarness(
      SkyAvatarHarness.with({ dataSkyId: 'test-avatar' }),
    );

    return { fixture, harness };
  }

  it('should return the specified initials', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getInitials()).toBeResolvedTo(undefined);

    fixture.componentRef.setInput('name', 'Jane Doe');

    await expectAsync(harness.getInitials()).toBeResolvedTo('JD');
  });

  it('should return the avatar URL if `src` is a string', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getSrc()).toBeResolvedTo(undefined);

    fixture.componentRef.setInput('src', 'https://example.com/image.png');

    await expectAsync(harness.getSrc()).toBeResolvedTo(
      'https://example.com/image.png',
    );
  });

  it('should return the avatar Blob if `src` is a Blob', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getSrc()).toBeResolvedTo(undefined);

    fixture.componentRef.setInput('src', new Blob(['a']));

    await expectAsync(harness.getSrc()).toBeResolvedTo(jasmine.any(Blob));
  });

  it('should return whether the user can change the avatar image', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.getCanChange()).toBeResolvedTo(false);

    fixture.componentRef.setInput('canChange', true);

    await expectAsync(harness.getCanChange()).toBeResolvedTo(true);
  });

  it('should set the avatar image', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentRef.setInput('canChange', true);
    fixture.detectChanges();

    const testFile = new File(['abc'], 'test.png', {
      type: 'image/png',
    });

    await harness.dropAvatarFile(testFile, true);

    const expectedByteArray = await getByteArray(testFile);
    const actualByteArray = await getByteArray(
      (await harness.getSrc()) as Blob,
    );

    expect(Array.from(actualByteArray)).toEqual(
      jasmine.arrayWithExactContents(Array.from(expectedByteArray)),
    );
  });

  it('should time out when waiting for avatar change if it does not change', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentInstance.updateSrcOnChange = false;

    fixture.componentRef.setInput('canChange', true);
    fixture.detectChanges();

    const testFile = new File(['abc'], 'test.png', {
      type: 'image/png',
    });

    await expectAsync(
      harness.dropAvatarFile(testFile, true),
    ).toBeRejectedWithError(
      'The avatar src did not change within the expected time span',
    );
  });

  it('should get whether a file type error modal is displayed', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.hasFileTypeError()).toBeResolvedTo(false);

    fixture.componentRef.setInput('canChange', true);
    fixture.detectChanges();

    await harness.dropAvatarFile(
      new File([], 'test.txt', {
        type: 'text/plain',
      }),
    );

    await expectAsync(harness.hasMaxSizeError()).toBeResolvedTo(false);
    await expectAsync(harness.hasFileTypeError()).toBeResolvedTo(true);
  });

  it('should get whether a file size error modal is displayed', async () => {
    const { fixture, harness } = await setupTest();

    await expectAsync(harness.hasFileTypeError()).toBeResolvedTo(false);

    fixture.componentRef.setInput('canChange', true);
    fixture.componentRef.setInput('maxFileSize', 1);
    fixture.detectChanges();

    await harness.dropAvatarFile(
      new File(['aa'], 'test.png', {
        type: 'image/png',
      }),
    );

    await expectAsync(harness.hasMaxSizeError()).toBeResolvedTo(true);
    await expectAsync(harness.hasFileTypeError()).toBeResolvedTo(false);

    await harness.closeError();
  });

  it('should close the file error modal', async () => {
    const { fixture, harness } = await setupTest();

    fixture.componentRef.setInput('canChange', true);
    fixture.detectChanges();

    await harness.dropAvatarFile(
      new File([], 'test.txt', {
        type: 'text/plain',
      }),
    );

    await expectAsync(harness.hasFileTypeError()).toBeResolvedTo(true);

    await harness.closeError();

    await expectAsync(harness.hasFileTypeError()).toBeResolvedTo(false);
  });

  it('should throw an error setting the avatar image when canChange is false', async () => {
    const { fixture, harness } = await setupTest();

    fixture.detectChanges();

    await expectAsync(
      harness.dropAvatarFile(
        new File([], 'test.png', {
          type: 'image/png',
        }),
      ),
    ).toBeRejectedWithError(
      'A new avatar cannot be selected because the canChange input is not set to true.',
    );
  });

  it('should throw an error trying to close an invalid file error modal when no error is visible', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.closeError()).toBeRejectedWithError(
      'No error is currently displayed.',
    );
  });
});
