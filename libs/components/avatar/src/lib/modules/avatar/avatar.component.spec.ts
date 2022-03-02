import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { SkyMatchers, expect } from '@skyux-sdk/testing';
import { ErrorModalConfig, SkyErrorModalService } from '@skyux/errors';
import { SkyFileDropChange, SkyFileItem } from '@skyux/forms';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyAvatarSize } from './avatar-size';
import { SkyAvatarComponent } from './avatar.component';
import { SkyAvatarFixturesModule } from './fixtures/avatar-fixtures.module';
import { AvatarTestComponent } from './fixtures/avatar.component.fixture';
import { MockErrorModalService } from './fixtures/mock-error-modal.service';

describe('Avatar component', () => {
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  /* tslint:disable-next-line max-line-length */
  const imgBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAYAAAD0In+KAAAAFElEQVR42gEJAPb/AP//////////I+UH+Rtap+gAAAAASUVORK5CYII=';
  const imgUrl = 'data:image/png;base64,' + imgBase64;

  const mockErrorModalService = new MockErrorModalService();

  function getFileDropTargetEl(el: Element): Element {
    return el.querySelector('.sky-file-drop-target');
  }

  function getWrapperEl(el: Element): Element {
    return el.querySelector('.sky-avatar-wrapper');
  }

  function getPhotoEl(el: Element): Element {
    return el.querySelector('.sky-avatar-image');
  }

  function getScreenReaderEl(el: Element): Element {
    return el.querySelector('.sky-screen-reader-only');
  }

  function getPlaceholderEl(el: Element): Element {
    return el.querySelector('.sky-avatar-initials');
  }

  function getImgBlob() {
    let n = imgBase64.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = imgBase64.charCodeAt(n);
    }

    const testBlob = new Blob([u8arr]);

    return testBlob;
  }

  function getBackgroundImageUrl(el: Element): string {
    const regex = /url\(\"(.*?)\"\)/gi;
    const backgroundImage = getComputedStyle(getPhotoEl(el)).backgroundImage;

    const match = regex.exec(backgroundImage);

    let url: string;

    if (match && match.length > 0) {
      url = match[1];
    } else {
      url = '';
    }

    return url;
  }

  function validateImageUrl(
    el: Element,
    url: string,
    startsWith: boolean = false
  ) {
    const backgroundImageUrl = getBackgroundImageUrl(el);

    if (startsWith) {
      expect(backgroundImageUrl.indexOf(url)).toBe(0);
    } else {
      expect(backgroundImageUrl).toBe(url);
    }
  }

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [SkyAvatarFixturesModule],
      providers: [
        {
          provide: SkyErrorModalService,
          useValue: mockErrorModalService,
        },
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
  });

  it('should display an image when an image URL is specified', () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.name = 'Robert Hernandez';
    fixture.componentInstance.src = imgUrl;

    fixture.detectChanges();

    const el = fixture.nativeElement;

    expect(getPhotoEl(el)).toBeVisible();
    expect(getPlaceholderEl(el)).not.toBeVisible();

    validateImageUrl(el, imgUrl);
  });

  it('should display an image when an image URL is specified with parenthesis', () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.name = 'Robert Hernandez';
    fixture.componentInstance.src = 'stff://fake(2).png/';

    fixture.detectChanges();

    const el = fixture.nativeElement;

    expect(getPhotoEl(el)).toBeVisible();
    expect(getPlaceholderEl(el)).not.toBeVisible();

    validateImageUrl(el, 'stff://fake(2).png/');
  });

  it('should include screen reader text when an image URL is specified', () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.name = 'Robert Hernandez';
    fixture.componentInstance.src = imgUrl;

    fixture.detectChanges();

    const el = fixture.nativeElement;

    const screenReaderEl: HTMLElement = getScreenReaderEl(el) as HTMLElement;
    expect(screenReaderEl).not.toBeNull();
    expect(screenReaderEl.textContent.trim()).toBe(
      'Profile picture of Robert Hernandez'
    );
  });

  it("should display the record name's initials when no image is specified", () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.name = 'Robert Hernandez';

    fixture.detectChanges();

    const el = fixture.nativeElement;

    expect(getPhotoEl(el)).not.toBeVisible();
    expect(getPlaceholderEl(el)).toBeVisible();

    expect(el.querySelector('.sky-avatar-initials-inner')).toHaveText('RH');

    fixture.componentInstance.name = 'Example';

    fixture.detectChanges();

    expect(el.querySelector('.sky-avatar-initials-inner')).toHaveText('E');
  });

  it('should not include screen reader text when no image is specified', () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.name = 'Robert Hernandez';

    fixture.detectChanges();

    const el = fixture.nativeElement;

    const screenReaderEl: HTMLElement = getScreenReaderEl(el) as HTMLElement;
    expect(screenReaderEl).toBeNull();
  });

  it('should display nothing when no image or name is specified', () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.detectChanges();

    const el = fixture.nativeElement;

    expect(getPhotoEl(el)).not.toBeVisible();
    expect(getPlaceholderEl(el)).not.toBeVisible();
  });

  it(`should provide a aria label describing adding a new profile image when one can be uploaded
  and has not been provided`, fakeAsync(() => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.name = 'Robert Hernandez';

    fixture.detectChanges();
    fixture.componentInstance.avatarComponent.canChange = true;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(
      getFileDropTargetEl(fixture.nativeElement).attributes.getNamedItem(
        'aria-label'
      ).value
    ).toBe(
      'Add profile photo of Robert Hernandez. Drag a file here or click to browse.'
    );
  }));

  it(`should provide a aria label describing changing a profile image when one has been uploaded`, fakeAsync(() => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.name = 'Robert Hernandez';
    fixture.componentInstance.src = imgUrl;

    fixture.detectChanges();
    fixture.componentInstance.avatarComponent.canChange = true;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    expect(
      getFileDropTargetEl(fixture.nativeElement).attributes.getNamedItem(
        'aria-label'
      ).value
    ).toBe(
      'Change profile photo of Robert Hernandez. Drag a file here or click to browse.'
    );
  }));

  it('should show the avatar when the specified source is a Blob object', function () {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.src = getImgBlob();

    fixture.detectChanges();

    const el = fixture.nativeElement;

    validateImageUrl(el, 'blob:', true);
  });

  it(`should clean up the current object URL created when the specified source is a Blbo object
    and the scope is destroyed`, () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);

    fixture.componentInstance.src = getImgBlob();

    fixture.detectChanges();

    const objectUrl = getBackgroundImageUrl(fixture.nativeElement);

    const revokeSpy = spyOn(URL, 'revokeObjectURL');

    fixture.destroy();

    expect(revokeSpy).toHaveBeenCalledWith(objectUrl);
  });

  it('should notify the consumer when the user chooses a new image', function () {
    const fixture = TestBed.createComponent(SkyAvatarComponent);
    const instance = fixture.componentInstance;
    let expectedFile: SkyFileItem;
    const actualFile = {
      file: {
        name: 'foo.png',
        type: 'image/png',
        size: 1000,
      },
    } as SkyFileItem;
    instance.canChange = true;
    instance.avatarChanged.subscribe(
      (newFile: SkyFileItem) => (expectedFile = newFile)
    );

    instance.photoDrop({
      files: [actualFile],
      rejectedFiles: [],
    });

    fixture.detectChanges();
    expect(expectedFile).toEqual(actualFile);
  });

  it('should not notify the consumer when the new image is rejected', function () {
    const fixture = TestBed.createComponent(SkyAvatarComponent);
    const instance = fixture.componentInstance;
    let expectedFile: SkyFileItem;
    const actualFile = {
      file: {
        name: 'foo.png',
        type: 'image/png',
        size: 1000,
      },
    } as SkyFileItem;

    instance.canChange = true;
    instance.avatarChanged.subscribe(
      (newFile: SkyFileItem) => (expectedFile = newFile)
    );

    instance.photoDrop({
      files: [],
      rejectedFiles: [actualFile],
    } as SkyFileDropChange);

    fixture.detectChanges();
    expect(expectedFile).not.toEqual(actualFile);
  });

  it('should show error modal when invalid file type is uploaded', function () {
    const fixture = TestBed.createComponent(SkyAvatarComponent);
    const instance = fixture.componentInstance;

    const badFileType = {
      file: {
        name: 'foo.txt',
        type: 'text',
        size: 1,
      },
      errorType: 'fileType',
    };

    spyOn(mockErrorModalService, 'open');

    instance.photoDrop({
      files: [],
      rejectedFiles: [badFileType],
    } as SkyFileDropChange);

    const config: ErrorModalConfig = {
      errorTitle: 'File is not an image.',
      errorDescription: 'Please choose a file that is a valid image.',
      errorCloseText: 'OK',
    };

    expect(mockErrorModalService.open).toHaveBeenCalledWith(config);
  });

  it('should show error modal when file larger than 500KB is uploaded', function () {
    const fixture = TestBed.createComponent(SkyAvatarComponent);
    const instance = fixture.componentInstance;

    const badFileType = {
      file: {
        name: 'foo.txt',
        type: 'text',
        size: 1,
      },
      errorType: 'maxFileSize',
    };

    spyOn(mockErrorModalService, 'open');

    instance.photoDrop({
      files: [],
      rejectedFiles: [badFileType],
    } as SkyFileDropChange);

    const config: ErrorModalConfig = {
      errorTitle: 'File is too large.',
      errorDescription: 'Please choose an image that is less than 500 KB.',
      errorCloseText: 'OK',
    };

    expect(mockErrorModalService.open).toHaveBeenCalledWith(config);
  });

  it('should show error modal when file larger than 5MB is uploaded', function () {
    const fixture = TestBed.createComponent(SkyAvatarComponent);
    const instance = fixture.componentInstance;

    fixture.componentInstance.maxFileSize = 5000000;

    const badFileType = {
      file: {
        name: 'foo.txt',
        type: 'text',
        size: 1,
      },
      errorType: 'maxFileSize',
    };

    spyOn(mockErrorModalService, 'open');

    instance.photoDrop({
      files: [],
      rejectedFiles: [badFileType],
    } as SkyFileDropChange);

    const config: ErrorModalConfig = {
      errorTitle: 'File is too large.',
      errorDescription: 'Please choose an image that is less than 5 MB.',
      errorCloseText: 'OK',
    };

    expect(mockErrorModalService.open).toHaveBeenCalledWith(config);
  });

  function validateWrapperSizeClass(
    fixture: ComponentFixture<AvatarTestComponent>,
    size: SkyAvatarSize
  ): void {
    fixture.componentInstance.size = size;
    fixture.detectChanges();

    const wrapperEl = getWrapperEl(fixture.nativeElement);

    (
      expect(wrapperEl).withContext(
        `When size is set to ${size}`
      ) as SkyMatchers<Element>
    ).toHaveCssClass(`sky-avatar-wrapper-size-${size || 'large'}`);
  }

  it('should add the expected CSS class for the specified size', () => {
    const fixture = TestBed.createComponent(AvatarTestComponent);
    fixture.detectChanges();

    validateWrapperSizeClass(fixture, undefined);
    validateWrapperSizeClass(fixture, 'large');
    validateWrapperSizeClass(fixture, 'medium');
    validateWrapperSizeClass(fixture, 'small');
  });

  describe('when modern theme', () => {
    function validatePlaceholderClass(
      fixture: ComponentFixture<AvatarTestComponent>,
      size: SkyAvatarSize,
      expectedClass: string
    ) {
      fixture.componentInstance.size = size;
      fixture.detectChanges();

      const initialsEl = fixture.nativeElement.querySelector(
        '.sky-avatar-initials-inner'
      );

      (
        expect(initialsEl).withContext(
          `When size is set to ${size}`
        ) as SkyMatchers<Element>
      ).toHaveCssClass(expectedClass);
    }

    beforeEach(() => {
      mockThemeSvc.settingsChange.next({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.modern,
          SkyThemeMode.presets.light
        ),
        previousSettings:
          mockThemeSvc.settingsChange.getValue().currentSettings,
      });
    });

    it('should add the expected class to the initials element for the specified size', () => {
      const fixture = TestBed.createComponent(AvatarTestComponent);
      fixture.detectChanges();

      validatePlaceholderClass(fixture, undefined, 'sky-font-display-2');
      validatePlaceholderClass(fixture, 'large', 'sky-font-display-2');
      validatePlaceholderClass(fixture, 'medium', 'sky-font-display-3');
      validatePlaceholderClass(fixture, 'small', 'sky-font-body-sm');
    });
  });
});
