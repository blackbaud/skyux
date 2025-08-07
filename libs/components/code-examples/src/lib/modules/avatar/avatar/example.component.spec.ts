import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAvatarHarness } from '@skyux/avatar/testing';

import { of } from 'rxjs';

import { AvatarExampleComponent } from './example.component';
import { DemoService } from './example.service';

describe('Basic avatar harness', () => {
  let uploadAvatarSpy: jasmine.Spy;

  beforeEach(() => {
    uploadAvatarSpy = jasmine
      .createSpy('uploadAvatarSpy')
      .and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        {
          provide: DemoService,
          useValue: {
            uploadAvatar: uploadAvatarSpy,
          },
        },
      ],
    });
  });

  async function setupTest(): Promise<{
    fixture: ComponentFixture<AvatarExampleComponent>;
    harness: SkyAvatarHarness;
  }> {
    const fixture = TestBed.createComponent(AvatarExampleComponent);
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const harness: SkyAvatarHarness = await loader.getHarness(
      SkyAvatarHarness.with({ dataSkyId: 'user-profile-avatar' }),
    );

    return { fixture, harness };
  }

  function createTestFile(fileSize: number): File {
    return new File(['a'.repeat(fileSize)], 'test.png', {
      type: 'image/png',
    });
  }

  it('should display the expected avatar image', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getInitials()).toBeResolvedTo(undefined);
    await expectAsync(harness.getSrc()).toBeResolvedTo(
      'https://imgur.com/tBiGElW.png',
    );
  });

  it('should allow the user to change the avatar', async () => {
    const { harness } = await setupTest();

    await expectAsync(harness.getCanChange()).toBeResolvedTo(true);
  });

  it('should upload a new avatar and set the avatar src', async () => {
    const { harness } = await setupTest();

    const testFile = createTestFile(100);

    await harness.dropAvatarFile(testFile, true);

    expect(uploadAvatarSpy).toHaveBeenCalledOnceWith(testFile);

    await expectAsync(harness.getSrc()).toBeResolvedTo(jasmine.any(Blob));
  });

  it('should now allow files larger than 1,000 bytes', async () => {
    const { harness } = await setupTest();

    const maxFileSize = 1000;

    await harness.dropAvatarFile(createTestFile(maxFileSize));
    await expectAsync(harness.hasMaxSizeError()).toBeResolvedTo(false);

    await harness.dropAvatarFile(createTestFile(maxFileSize + 1));
    await expectAsync(harness.hasMaxSizeError()).toBeResolvedTo(true);

    await harness.closeError();
  });
});
