import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIdService, SkyLiveAnnouncerService } from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
} from '@skyux/core/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyFileItem } from '../shared/file-item';

import { SkyFileAttachmentChange } from './file-attachment-change';
import { SkyFileAttachmentComponent } from './file-attachment.component';
import { FileAttachmentTestComponent } from './fixtures/file-attachment.component.fixture';
import { TemplateDrivenFileAttachmentTestComponent } from './fixtures/template-driven-file-attachment.component.fixture';

function getInputDebugEl(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('input'));
}

function getButtonEl(el: HTMLElement): HTMLElement | null {
  return el.querySelector('.sky-file-attachment-btn');
}

function getDeleteButtonEl(el: HTMLElement): HTMLButtonElement | null {
  return el.querySelector('.sky-file-attachment-delete');
}

describe('File attachment', () => {
  let fixture: ComponentFixture<FileAttachmentTestComponent>;
  let el: HTMLElement;
  let fileAttachmentInstance: SkyFileAttachmentComponent;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  let liveAnnouncerSpy: jasmine.Spy;

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [FileAttachmentTestComponent, SkyHelpTestingModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    let idIndex = 0;
    spyOn(TestBed.inject(SkyIdService), 'generateId').and.callFake(() => {
      return `MOCK_ID_${idIndex++}`;
    });

    liveAnnouncerSpy = spyOn(
      TestBed.inject(SkyLiveAnnouncerService),
      'announce',
    );

    jasmine.clock().install();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileAttachmentTestComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
    fileAttachmentInstance = fixture.componentInstance.fileAttachmentComponent;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  //#region helpers
  function getDropEl(): HTMLElement | null {
    return el.querySelector('.sky-file-attachment');
  }

  function getDropDebugEl(): DebugElement {
    return fixture.debugElement.query(By.css('.sky-file-attachment'));
  }

  function getFileNameLinkEl(): HTMLElement | null {
    return el.querySelector('.sky-file-attachment-file-link a');
  }

  function getFileNameText(): string | undefined {
    return el
      .querySelector('.sky-file-attachment-file-link')
      ?.textContent?.trim();
  }

  function getDeleteEl(): HTMLElement | null {
    return el.querySelector('.sky-file-attachment-delete');
  }

  function validateDropClasses(
    hasAccept: boolean,
    hasReject: boolean,
    dropEl: any,
  ): void {
    expect(dropEl.classList.contains('sky-file-attachment-accept')).toBe(
      hasAccept,
    );
    expect(dropEl.classList.contains('sky-file-attachment-reject')).toBe(
      hasReject,
    );
  }

  function validateLabelText(expectedLabel: string) {
    const label = getLabelWrapper();
    expect(label?.textContent?.trim()).toBe(expectedLabel);
  }

  function getImage(): DebugElement | null {
    return fixture.debugElement.query(
      By.css('.sky-file-attachment-preview-img'),
    ) as DebugElement | null;
  }

  function testImage(extension: string): void {
    const testFile = {
      file: {
        name: 'myFile.' + extension,
        type: 'image/' + extension,
        size: 1000,
      },
      url: '$/myFile.' + extension,
    };
    fileAttachmentInstance.writeValue(testFile);

    fixture.detectChanges();

    const imageEl = getImage();
    expect(imageEl?.nativeElement?.getAttribute('src')).toBe(
      '$/myFile.' + extension,
    );
  }

  function testNonImageType(extension: string, type: string): void {
    const testFile = {
      file: {
        name: 'myFile.' + extension,
        type: type + '/' + extension,
        size: 1000,
      },
      url: '$/myFile.' + extension,
    };
    fileAttachmentInstance.writeValue(testFile);
    fixture.detectChanges();

    const imageEl = getImage();
    expect(imageEl).toBeFalsy();
  }

  function getLabelWrapper(): HTMLElement | null {
    return el.querySelector('.sky-file-attachment-label-wrapper');
  }

  async function triggerChangeEvent(expectedChangeFiles: any[]): Promise<void> {
    const inputEl = getInputDebugEl(fixture);

    const fileChangeEvent = {
      target: {
        files: {
          length: expectedChangeFiles.length,
          item: function (index: number): any {
            return expectedChangeFiles[index];
          },
        },
      },
    };

    inputEl.triggerEventHandler('change', fileChangeEvent);

    fixture.detectChanges();
    await fixture.whenStable();

    jasmine.clock().tick(501);

    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getFileReaderSpyData(existingSpy?: jasmine.Spy): {
    loadCallbacks: ((opts: {
      target: {
        result: string;
      };
    }) => void)[];
    errorCallbacks: (() => void)[];
    abortCallbacks: (() => void)[];
    fileReaderSpy: jasmine.Spy;
  } {
    const loadCallbacks: ((opts: {
      target: {
        result: string;
      };
    }) => void)[] = [];
    const errorCallbacks: (() => void)[] = [];
    const abortCallbacks: (() => void)[] = [];

    const fileReaderSpy = existingSpy ?? spyOn(window as any, 'FileReader');
    fileReaderSpy.and.returnValue({
      readAsDataURL: function (): void {},
      addEventListener: function (type: string, callback: () => void): void {
        if (type === 'load') {
          loadCallbacks.push(callback);
        } else if (type === 'error') {
          errorCallbacks.push(callback);
        } else if (type === 'abort') {
          abortCallbacks.push(callback);
        }
      },
    });

    return {
      loadCallbacks,
      errorCallbacks,
      abortCallbacks,
      fileReaderSpy,
    };
  }

  async function setupStandardFileChangeEvent(
    files?: any[],
    existingSpy?: jasmine.Spy,
  ): Promise<jasmine.Spy> {
    const fileReaderSpyData = getFileReaderSpyData(existingSpy);

    if (!files) {
      files = [
        {
          name: 'foo.txt',
          size: 1000,
          type: 'image/png',
        },
      ];
    }
    await triggerChangeEvent(files);

    fixture.componentInstance.attachment.markAsTouched();
    fixture.detectChanges();

    if (fileReaderSpyData.loadCallbacks[0]) {
      fileReaderSpyData.loadCallbacks[0]({
        target: {
          result: '$/url',
        },
      });
    }

    if (fileReaderSpyData.loadCallbacks[1]) {
      fileReaderSpyData.loadCallbacks[1]({
        target: {
          result: 'newUrl',
        },
      });
    }

    fixture.detectChanges();
    return fileReaderSpyData.fileReaderSpy;
  }

  function triggerDragEnter(enterTarget: any, dropDebugEl: DebugElement): void {
    const dragEnterPropStoppedSpy = jasmine.createSpy();
    const dragEnterPreventDefaultSpy = jasmine.createSpy();

    const dragEnterEvent = {
      target: enterTarget,
      stopPropagation: dragEnterPropStoppedSpy,
      preventDefault: dragEnterPreventDefaultSpy,
    };

    expect(dragEnterPropStoppedSpy).not.toHaveBeenCalled();
    expect(dragEnterPreventDefaultSpy).not.toHaveBeenCalled();

    dropDebugEl.triggerEventHandler('dragenter', dragEnterEvent);
    fixture.detectChanges();

    expect(dragEnterPropStoppedSpy).toHaveBeenCalled();
    expect(dragEnterPreventDefaultSpy).toHaveBeenCalled();
  }

  function triggerDragOver(
    files: any[] | undefined,
    items: any[] | undefined,
    dropDebugEl: DebugElement,
  ): void {
    const dragOverPropStoppedSpy = jasmine.createSpy();
    const dragOverPreventDefaultSpy = jasmine.createSpy();

    const dragOverEvent = {
      dataTransfer: {
        files: files,
        items: items,
      },
      stopPropagation: dragOverPropStoppedSpy,
      preventDefault: dragOverPreventDefaultSpy,
    };

    expect(dragOverPropStoppedSpy).not.toHaveBeenCalled();
    expect(dragOverPreventDefaultSpy).not.toHaveBeenCalled();

    dropDebugEl.triggerEventHandler('dragover', dragOverEvent);
    fixture.detectChanges();

    expect(dragOverPropStoppedSpy).toHaveBeenCalled();
    expect(dragOverPreventDefaultSpy).toHaveBeenCalled();
  }

  async function triggerDrop(
    files: any[],
    dropDebugEl: DebugElement,
  ): Promise<void> {
    const dropPropStoppedSpy = jasmine.createSpy();
    const dropPreventDefaultSpy = jasmine.createSpy();
    const fileLength = files ? files.length : 0;

    const dropEvent = {
      dataTransfer: {
        files: {
          length: fileLength,
          item: function (index: number): any {
            return files[index];
          },
        },
        items: files,
      },
      stopPropagation: dropPropStoppedSpy,
      preventDefault: dropPreventDefaultSpy,
    };

    expect(dropPropStoppedSpy).not.toHaveBeenCalled();
    expect(dropPreventDefaultSpy).not.toHaveBeenCalled();

    dropDebugEl.triggerEventHandler('drop', dropEvent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(dropPropStoppedSpy).toHaveBeenCalled();
    expect(dropPreventDefaultSpy).toHaveBeenCalled();
  }

  function triggerDragLeave(leaveTarget: any, dropDebugEl: DebugElement): void {
    const dragLeaveEvent = {
      target: leaveTarget,
    };

    dropDebugEl.triggerEventHandler('dragleave', dragLeaveEvent);
    fixture.detectChanges();
  }
  //#endregion

  it('should not have required class and aria-required attribute and label should not have screen reader text when not required', fakeAsync(() => {
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const labelWrapper = getLabelWrapper();
    const input = getInputDebugEl(fixture);

    expect(input.nativeElement.getAttribute('required')).toBeNull();
    expect(labelWrapper?.classList.contains('sky-control-label-required')).toBe(
      false,
    );
    expect(labelWrapper?.getAttribute('aria-required')).toBeNull();
    expect(labelWrapper?.querySelector('.sky-screen-reader-only')).toBeNull();
  }));

  it('should have appropriate classes and label should have screen reader text when file is required', fakeAsync(() => {
    fixture.componentInstance.required = true;
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const labelWrapper = getLabelWrapper();
    const input = getInputDebugEl(fixture);

    expect(input.nativeElement.getAttribute('required')).not.toBeNull();
    expect(labelWrapper?.classList.contains('sky-control-label-required')).toBe(
      true,
    );
    expect(
      labelWrapper?.querySelector('.sky-screen-reader-only')?.textContent,
    ).toBe('Required');
  }));

  it('should have appropriate classes and label should have screen reader text when file is required and label text is used', fakeAsync(() => {
    fixture.componentInstance.required = true;
    fixture.componentInstance.labelText = 'Testing';
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const labelWrapper = getLabelWrapper();
    const input = getInputDebugEl(fixture);

    expect(input.nativeElement.getAttribute('required')).not.toBeNull();
    expect(
      fixture.nativeElement
        .querySelector('span.sky-control-label')
        .classList.contains('sky-control-label-required'),
    ).toBe(true);
    expect(
      labelWrapper?.querySelector('.sky-screen-reader-only')?.textContent,
    ).toBe('Required');
  }));

  it('should have appropriate classes when file is required and initialized with file', fakeAsync(() => {
    fixture.componentInstance.required = true;
    const testFile = {
      file: {
        name: 'myFile',
        type: '',
        size: 1,
      },
      url: '$/myFile',
    } as SkyFileItem;
    fileAttachmentInstance.value = testFile;
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const labelWrapper = getLabelWrapper();
    const input = getInputDebugEl(fixture);

    expect(input.nativeElement.getAttribute('required')).not.toBeNull();
    expect(labelWrapper?.classList.contains('sky-control-label-required')).toBe(
      true,
    );
  }));

  it('should not have disabled attribute when not disabled', fakeAsync(() => {
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const input = getInputDebugEl(fixture);
    const button = getButtonEl(el);

    expect(input.nativeElement.getAttribute('disabled')).toBeNull();
    expect(button?.getAttribute('disabled')).toBeNull();
  }));

  it(`should have disabled attribute when form control's disabled method is called`, fakeAsync(() => {
    fixture.componentInstance.attachment.disable();
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const input = getInputDebugEl(fixture);
    const button = getButtonEl(el);

    expect(input.nativeElement.getAttribute('disabled')).not.toBeNull();
    expect(button?.getAttribute('disabled')).not.toBeNull();

    fixture.componentInstance.attachment.enable();
    tick();
    fixture.detectChanges();

    expect(input.nativeElement.getAttribute('disabled')).toBeNull();
    expect(button?.getAttribute('disabled')).toBeNull();
  }));

  it('should handle removing the label', fakeAsync(() => {
    fixture.componentInstance.required = true;
    fileAttachmentInstance.ngAfterViewInit();
    fileAttachmentInstance.ngAfterContentInit();
    tick();
    fixture.detectChanges();

    const labelWrapper = getLabelWrapper();

    expect(labelWrapper?.classList.contains('sky-control-label-required')).toBe(
      true,
    );

    fixture.componentInstance.showLabel = false;
    fixture.detectChanges();

    expect(labelWrapper?.classList.contains('sky-control-label-required')).toBe(
      false,
    );
  }));

  it('should handle removing the labelText', fakeAsync(() => {
    fixture.componentInstance.labelText = 'label text';
    fixture.componentInstance.labelElementText = undefined;
    fixture.componentInstance.showLabel = false;

    fileAttachmentInstance.ngAfterViewInit();
    fileAttachmentInstance.ngAfterContentInit();
    tick();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('span.sky-control-label'),
    ).toBeDefined();

    fixture.componentInstance.labelText = undefined;
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('span.sky-control-label'),
    ).toBeNull();
  }));

  it('should click the file input on choose file button click', () => {
    fixture.detectChanges();

    const inputEl = getInputDebugEl(fixture);

    spyOn(inputEl.references['fileInputRef'], 'click');

    const dropEl = getButtonEl(el);

    expect(inputEl.references['fileInputRef'].click).not.toHaveBeenCalled();

    dropEl?.click();

    fixture.detectChanges();

    expect(inputEl.references['fileInputRef'].click).toHaveBeenCalled();
  });

  it('should not click the file input on remove button click', async () => {
    fixture.detectChanges();

    const inputEl = getInputDebugEl(fixture);

    spyOn(inputEl.references['fileInputRef'], 'click');

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);

    const deleteEl = getDeleteEl();

    expect(inputEl.references['fileInputRef'].click).not.toHaveBeenCalled();

    deleteEl?.click();

    fixture.detectChanges();

    expect(inputEl.references['fileInputRef'].click).not.toHaveBeenCalled();
  });

  // Maybe some other tests here about dragging
  it('should load and emit file on file change event', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);
    await fixture.whenStable();

    expect(fileChangeActual?.file).toBeTruthy();
    expect(fileChangeActual?.file?.url).toBe('$/url');
    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');
    expect(liveAnnouncerSpy.calls.count()).toBe(1);
  });

  it('should load and emit files on file change event when file reader has an error and aborts', async () => {
    let filesChangedActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (filesChanged: SkyFileAttachmentChange) => {
        filesChangedActual = filesChanged;
      },
    );

    const fileReaderSpy = getFileReaderSpyData();

    await triggerChangeEvent([
      {
        name: 'woo.txt',
        size: 3000,
      },
    ]);
    fixture.detectChanges();

    fileReaderSpy.abortCallbacks[0]();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(filesChangedActual?.file?.url).toBeFalsy();
    expect(filesChangedActual?.file?.file.name).toBe('woo.txt');
    expect(filesChangedActual?.file?.file.size).toBe(3000);

    await triggerChangeEvent([
      {
        name: 'foo.txt',
        size: 2000,
      },
    ]);
    fixture.detectChanges();

    fileReaderSpy.errorCallbacks[1]();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(filesChangedActual?.file?.url).toBeFalsy();
    expect(filesChangedActual?.file?.file.name).toBe('foo.txt');
    expect(filesChangedActual?.file?.file.size).toBe(2000);
  });

  it('should clear file on remove press', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);
    await fixture.whenStable();
    fixture.detectChanges();

    liveAnnouncerSpy.calls.reset();

    const deleteEl = getDeleteEl();

    deleteEl?.click();

    fixture.detectChanges();

    expect(fileChangeActual?.file).toBeFalsy();
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt removed.');
    expect(liveAnnouncerSpy.calls.count()).toBe(1);
  });

  it('should show the appropriate file name', () => {
    // Regular file
    let testFile: {
      file: {
        name: string | undefined;
        size: number;
        type: string;
      };
      url: string;
    } = {
      file: {
        name: 'test.png',
        size: 1000,
        type: 'image/png',
      },
      url: '$/myFile',
    };
    fileAttachmentInstance.writeValue(testFile);
    fixture.detectChanges();

    expect(getFileNameText()).toBe('test.png');

    // File with truncated name
    testFile = {
      file: {
        name: 'abcdefghijklmnopqrstuvwxyz12345.png',
        size: 1000,
        type: 'image/png',
      },
      url: '$/myFile',
    };
    fileAttachmentInstance.writeValue(testFile);
    fixture.detectChanges();

    expect(getFileNameText()).toBe('abcdefghijklmnopqrstuvwxyz...');

    expect(
      el
        .querySelector('.sky-file-attachment-file-link > a')
        ?.getAttribute('title'),
    ).toBe(
      'abcdefghijklmnopqrstuvwxyz12345.png',
      'Expected the anchor title to display the full file name.',
    );

    // File with no name
    testFile = {
      file: {
        name: undefined,
        size: 1000,
        type: 'image/png',
      },
      url: '$/myFile',
    };
    fileAttachmentInstance.writeValue(testFile);
    fixture.detectChanges();

    expect(getFileNameText()).toBe('$/myFile');

    // no file
    fileAttachmentInstance.writeValue(undefined);
    fixture.detectChanges();

    expect(getFileNameText()).toBe('No file chosen.');
    expect(fileAttachmentInstance.fileName).toBe('');

    // File with no name and truncated url
    testFile = {
      file: {
        name: undefined,
        size: 1000,
        type: 'image/txt',
      },
      url: '$/abcdefghijklmnopqrstuvwxyz12345',
    };
    fileAttachmentInstance.writeValue(testFile);
    fixture.detectChanges();

    /* spell-checker:disable-next-line */
    expect(getFileNameText()).toBe('$/abcdefghijklmnopqrstuvwx...');
  });

  it('should emit fileClick even when the uploaded file link is clicked', () => {
    const testFile = {
      file: {
        name: 'test.png',
        size: 1000,
        type: 'image/png',
      },
      url: '$/myFile',
    } as SkyFileItem;

    spyOn(fileAttachmentInstance.fileClick, 'emit');

    fileAttachmentInstance.writeValue(testFile);
    fixture.detectChanges();

    const fileNameEl = getFileNameLinkEl();

    fileNameEl?.click();

    expect(fileAttachmentInstance.fileClick.emit).toHaveBeenCalledWith({
      file: testFile,
    });
  });

  it('should load files and set classes on drag and drop', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    const fileReaderSpy = getFileReaderSpyData();

    fileAttachmentInstance.acceptedTypes = 'image/png, image/tiff';

    fixture.detectChanges();

    const dropDebugEl = getDropDebugEl();
    const dropEl = getDropEl();

    const files = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    const invalidFiles = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/jpeg',
      },
    ];

    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, files, dropDebugEl);
    validateDropClasses(true, false, dropEl);

    await triggerDrop(files, dropDebugEl);
    validateDropClasses(false, false, dropEl);

    fileReaderSpy.loadCallbacks[0]({
      target: {
        result: '$/url',
      },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fileChangeActual?.file).toBeTruthy();
    expect(fileChangeActual?.file?.errorType).toBeFalsy();
    expect(fileChangeActual?.file?.url).toBe('$/url');
    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);

    // Verify reject classes when appropriate
    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, invalidFiles, dropDebugEl);
    validateDropClasses(false, true, dropEl);
    triggerDragLeave('something', dropDebugEl);
    validateDropClasses(false, true, dropEl);
    triggerDragLeave('sky-file-attachment', dropDebugEl);
    validateDropClasses(false, false, dropEl);

    // Verify empty file array
    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, [], dropDebugEl);
    validateDropClasses(false, false, dropEl);

    // Verify undefined files
    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, undefined, dropDebugEl);
    validateDropClasses(false, false, dropEl);

    const emptyEvent = {
      stopPropagation: () => {},
      preventDefault: () => {},
    };

    // Verify no dataTransfer drag
    dropDebugEl.triggerEventHandler('dragover', emptyEvent);
    fixture.detectChanges();
    validateDropClasses(false, false, dropEl);

    // Verify no dataTransfer drop
    fileReaderSpy.loadCallbacks = [];
    dropDebugEl.triggerEventHandler('drop', emptyEvent);
    fixture.detectChanges();
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it('should allow for replacing the selected file with drag and drop', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.acceptedTypes = 'image/png, image/tiff';

    fixture.detectChanges();

    const initialFile = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    const fileReaderSpy = await setupStandardFileChangeEvent(initialFile);
    await fixture.whenStable();

    expect(fileChangeActual?.file).toBeTruthy();
    expect(fileChangeActual?.file?.url).toBe('$/url');
    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');
    expect(liveAnnouncerSpy.calls.count()).toBe(1);

    // Resets the file reader spy
    const spyData = getFileReaderSpyData(fileReaderSpy);

    const dropDebugEl = getDropDebugEl();
    const dropEl = getDropEl();

    const replacementFile = [
      {
        name: 'woo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, replacementFile, dropDebugEl);
    validateDropClasses(true, false, dropEl);

    await triggerDrop(replacementFile, dropDebugEl);
    validateDropClasses(false, false, dropEl);

    // Triggers the change event for watching
    spyData.loadCallbacks[0]({
      target: {
        result: '$/url',
      },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fileChangeActual?.file).toBeTruthy();
    expect(fileChangeActual?.file?.errorType).toBeFalsy();
    expect(fileChangeActual?.file?.url).toBe('$/url');
    expect(fileChangeActual?.file?.file.name).toBe('woo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith(
      'foo.txt removed. woo.txt added.',
    );
    expect(liveAnnouncerSpy.calls.count()).toBe(2);
  });

  it(
    'should accept a file of rejected type on drag (but not on drop) ' +
      'if the browser does not support dataTransfer.items',
    async () => {
      fileAttachmentInstance.acceptedTypes = 'image/png, image/tiff';

      fixture.detectChanges();

      const dropDebugEl = getDropDebugEl();

      const invalidFiles = [
        {
          name: 'foo.txt',
          size: 1000,
          type: 'image/jpeg',
        },
      ];

      const dropEl = getDropEl();

      triggerDragEnter('sky-file-attachment', dropDebugEl);
      triggerDragOver(invalidFiles, undefined, dropDebugEl);
      validateDropClasses(true, false, dropEl);

      await triggerDrop(invalidFiles, dropDebugEl);
      validateDropClasses(false, false, dropEl);
    },
  );

  it('should prevent loading multiple files on drag and drop', async () => {
    const files = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
      {
        name: 'goo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    const fileReaderSpy = getFileReaderSpyData();

    const dropDebugEl = getDropDebugEl();

    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, files, dropDebugEl);
    await triggerDrop(files, dropDebugEl);
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it('should prevent loading directories on drag and drop', async () => {
    const files = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
        webkitGetAsEntry: function (): { isDirectory: boolean } {
          return {
            isDirectory: true,
          };
        },
      },
    ];

    const fileReaderSpy = getFileReaderSpyData();
    fixture.detectChanges();

    const dropDebugEl = getDropDebugEl();

    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, files, dropDebugEl);
    await triggerDrop(files, dropDebugEl);
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it('should allow the user to specify a min file size', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.minFileSize = 1500;
    fixture.detectChanges();

    await setupStandardFileChangeEvent();

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.errorType).toBe('minFileSize');
    expect(fileChangeActual?.file?.errorParam).toBe('1500');

    expect(fileAttachmentInstance.value).toBeFalsy();
  });

  it('should respect a default min file size of 0', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    const spy = await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.errorType).toBeUndefined();
    expect(fileChangeActual?.file?.errorParam).toBeUndefined();

    expect(fileAttachmentInstance.value).toBeTruthy();

    // The `as` statement is needed as the analyzer does not know about the subscription that sets this back and causes issues with the future check.
    fileChangeActual = undefined as SkyFileAttachmentChange | undefined;
    fileAttachmentInstance.value = undefined;

    fileAttachmentInstance.minFileSize = 1500;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(undefined, spy);
    await fixture.whenStable();

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.errorType).toBe('minFileSize');
    expect(fileChangeActual?.file?.errorParam).toBe('1500');

    expect(fileAttachmentInstance.value).toBeFalsy();

    // The `as` statement is needed as the analyzer does not know about the subscription that sets this back and causes issues with the future check.
    fileChangeActual = undefined as SkyFileAttachmentChange | undefined;
    fileAttachmentInstance.minFileSize = undefined;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(undefined, spy);
    await fixture.whenStable();

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.errorType).toBeUndefined();
    expect(fileChangeActual?.file?.errorParam).toBeUndefined();

    expect(fileAttachmentInstance.value).toBeTruthy();
  });

  it('should allow the user to specify a max file size', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.maxFileSize = 1500;
    fixture.detectChanges();

    const file = [
      {
        name: 'woo.txt',
        size: 2000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);

    expect(fileChangeActual?.file?.file.name).toBe('woo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(2000);
    expect(fileChangeActual?.file?.errorType).toBe('maxFileSize');
    expect(fileChangeActual?.file?.errorParam).toBe('1500');

    expect(fileAttachmentInstance.value).toBeFalsy();
  });

  it('should respect a default max file size of 500000', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    const file = [
      {
        name: 'woo.txt',
        size: 500001,
        type: 'image/png',
      },
    ];

    const spy = await setupStandardFileChangeEvent(file);

    expect(fileChangeActual?.file?.file.name).toBe('woo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(500001);
    expect(fileChangeActual?.file?.errorType).toBe('maxFileSize');
    expect(fileChangeActual?.file?.errorParam).toBe('500000');

    expect(fileAttachmentInstance.value).toBeFalsy();

    fileAttachmentInstance.maxFileSize = undefined;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(file, spy);

    expect(fileChangeActual?.file?.file.name).toBe('woo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(500001);
    expect(fileChangeActual?.file?.errorType).toBe('maxFileSize');
    expect(fileChangeActual?.file?.errorParam).toBe('500000');

    expect(fileAttachmentInstance.value).toBeFalsy();
  });

  it('should set errors if file fails user provided validation function', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    const errorMessage =
      'You may not upload a file that begins with the letter "w."';

    fileAttachmentInstance.validateFn = function (
      inputFile: SkyFileItem,
    ): string | undefined {
      if (inputFile.file.name.indexOf('w') === 0) {
        return errorMessage;
      }
      return;
    };

    fixture.detectChanges();

    const file = [
      {
        name: 'woo.txt',
        size: 2000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);

    expect(fileChangeActual?.file?.file.name).toBe('woo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(2000);
    expect(fileChangeActual?.file?.errorType).toBe('validate');
    expect(fileChangeActual?.file?.errorParam).toBe(errorMessage);

    expect(fileAttachmentInstance.value).toBeFalsy();
  });

  it('should accept if file passes user provided validation function', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    const errorMessage =
      'You may not upload a file that begins with the letter "w."';

    fileAttachmentInstance.validateFn = function (
      inputFile: any,
    ): string | undefined {
      if (inputFile.file.name.indexOf('w') === 0) {
        return errorMessage;
      }
      return;
    };

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);
    await fixture.whenStable();

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.url).toBe('$/url');

    expect(fileAttachmentInstance.value).toBeTruthy();
  });

  it('should accept a file when type is accepted', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.acceptedTypes = 'image/png,image/tiff';

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);
    await fixture.whenStable();

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.url).toBe('$/url');
  });

  it('should reject a file with a type that is not accepted', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.acceptedTypes = 'image/png,image/tiff';

    fixture.detectChanges();

    const file = [
      {
        name: 'woo.txt',
        size: 2000,
        type: 'image/jpeg',
      },
    ];

    await setupStandardFileChangeEvent(file);

    expect(fileChangeActual?.file?.file.name).toBe('woo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(2000);
    expect(fileChangeActual?.file?.errorType).toBe('fileType');
    expect(fileChangeActual?.file?.errorParam).toBe('PNG, TIFF');
  });

  it('should reject a file with no type when accepted types are defined', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.acceptedTypes = 'image/png,image/tiff';

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
      },
    ];

    await setupStandardFileChangeEvent(file);

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.errorType).toBe('fileType');
    expect(fileChangeActual?.file?.errorParam).toBe('PNG, TIFF');
  });

  it('should allow the user to specify accepted type with wildcards', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.acceptedTypes = 'application/*,image/*';

    fixture.detectChanges();

    const file = [
      {
        name: 'woo.txt',
        size: 2000,
        type: 'image/jpeg',
      },
    ];

    await setupStandardFileChangeEvent(file);
    await fixture.whenStable();

    expect(fileChangeActual?.file?.file.name).toBe('woo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(2000);
    expect(fileChangeActual?.file?.url).toBe('$/url');
  });

  it('should accept multiple types using a wildcard', async () => {
    let fileChangeActual: SkyFileAttachmentChange | undefined;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange),
    );

    fileAttachmentInstance.acceptedTypes = 'application/*,image/*';

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    await setupStandardFileChangeEvent(file);
    await fixture.whenStable();

    expect(fileChangeActual?.file?.file.name).toBe('foo.txt');
    expect(fileChangeActual?.file?.file.size).toBe(1000);
    expect(fileChangeActual?.file?.url).toBe('$/url');
  });

  it('shows the thumbnail if the item is an image', () => {
    testImage('png');
    testImage('bmp');
    testImage('jpeg');
    testImage('gif');
  });

  it('does not show an icon if it is not an image', () => {
    testNonImageType('pdf', 'pdf');
    testNonImageType('gz', 'gz');
    testNonImageType('rar', 'rar');
    testNonImageType('tgz', 'tgz');
    testNonImageType('zip', 'zip');
    testNonImageType('ppt', 'ppt');
    testNonImageType('pptx', 'pptx');
    testNonImageType('doc', 'doc');
    testNonImageType('docx', 'docx');
    testNonImageType('xls', 'xls');
    testNonImageType('xlsx', 'xlsx');
    testNonImageType('txt', 'txt');
    testNonImageType('htm', 'htm');
    testNonImageType('html', 'html');
    testNonImageType('mp3', 'audio');
    testNonImageType('tiff', 'image');
    testNonImageType('other', 'text');
    testNonImageType('mp4', 'video');
  });

  it('should not show an icon if file or type does not exist', () => {
    const imageEl = getImage();
    expect(imageEl).toBeFalsy();

    fileAttachmentInstance.value = {
      file: undefined as any,
      url: '$/myFile',
    } as SkyFileItem;
    fixture.detectChanges();

    expect(imageEl).toBeFalsy();

    fileAttachmentInstance.value = {
      file: {
        name: 'myFile.png',
        type: undefined,
        size: 1000,
      } as any,
      url: '$/myFile',
    } as SkyFileItem;
    fixture.detectChanges();

    expect(imageEl).toBeFalsy();

    fileAttachmentInstance.value = undefined;
    fixture.detectChanges();

    expect(imageEl).toBeFalsy();
  });

  it('should show inline help', () => {
    fixture.componentInstance.showInlineHelp = true;
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.sky-help-inline'),
    ).toBeTruthy();
  });

  it('should pass accessibility', async () => {
    jasmine.clock().uninstall();
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should pass accessibility when required', async () => {
    jasmine.clock().uninstall();
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should pass accessibility when label does not match the button text', async () => {
    jasmine.clock().uninstall();
    fixture.componentInstance.labelElementText = 'Something different';
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should pass accessibility when `labelText` is set', async () => {
    jasmine.clock().uninstall();
    fixture.componentInstance.labelText = 'Attach file';
    fixture.componentInstance.labelElementText = undefined;
    fixture.detectChanges();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should set ARIA attributes', async () => {
    jasmine.clock().uninstall();
    const componentInstance = fixture.componentInstance;

    fixture.detectChanges();

    componentInstance.fileForm.setValue({
      attachment: {
        file: {
          name: 'my-file.png',
          type: 'image/png',
          size: 1000,
        },
        url: '$/myFile',
      },
    });

    // w/ legacy label component
    componentInstance.labelText = undefined;
    componentInstance.showLabel = true;
    fixture.detectChanges();

    const btn = getButtonEl(fixture.nativeElement);
    const deleteBtn = getDeleteButtonEl(fixture.nativeElement);

    expect(btn?.getAttribute('aria-describedby')).toEqual('MOCK_ID_3');
    expect(btn?.getAttribute('aria-labelledby')).toEqual('MOCK_ID_5 MOCK_ID_7');
    expect(deleteBtn?.getAttribute('aria-labelledby')).toEqual(
      'MOCK_ID_6 MOCK_ID_7',
    );

    await expectAsync(fixture.nativeElement).toBeAccessible();

    // w/ label text
    componentInstance.labelText = 'Sample label';
    componentInstance.showLabel = false;
    fixture.detectChanges();

    expect(btn?.getAttribute('aria-describedby')).toEqual('MOCK_ID_3');
    expect(btn?.getAttribute('aria-labelledby')).toEqual('MOCK_ID_5 MOCK_ID_2');
    expect(deleteBtn?.getAttribute('aria-labelledby')).toEqual(
      'MOCK_ID_6 MOCK_ID_2',
    );

    await expectAsync(fixture.nativeElement).toBeAccessible();

    // w/o label text or legacy label component
    componentInstance.labelText = undefined;
    componentInstance.showLabel = false;
    fixture.detectChanges();

    expect(btn?.getAttribute('aria-describedby')).toEqual('MOCK_ID_3');
    expect(btn?.getAttribute('aria-labelledby')).toEqual('MOCK_ID_5');
    expect(deleteBtn?.getAttribute('aria-labelledby')).toEqual('MOCK_ID_6');

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should not render form errors when label text is not set', () => {
    fixture.componentInstance.required = true;

    getButtonEl(fixture.nativeElement)?.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('sky-form-error')).toBeNull();
  });

  it('should render form errors when label text is set', () => {
    const btn = getButtonEl(fixture.nativeElement);
    expect(btn?.getAttribute('aria-invalid')).toEqual('false');
    expect(btn?.getAttribute('aria-errormessage')).toBeNull();

    fixture.componentInstance.required = true;
    fixture.componentInstance.labelText = 'file attachment';
    fixture.detectChanges();

    fixture.componentInstance.attachment.markAsTouched();
    fixture.detectChanges();

    expect(btn?.getAttribute('aria-invalid')).toEqual('true');
    expect(btn?.getAttribute('aria-errormessage')).toEqual('MOCK_ID_1');
    expect(
      fixture.nativeElement.querySelector('sky-form-error')?.textContent.trim(),
    ).toBe('Error: file attachment is required.');
  });

  it('should render file errors when label text is set and no NgControl errors', async () => {
    const btn = getButtonEl(fixture.nativeElement);
    expect(btn?.getAttribute('aria-invalid')).toEqual('false');
    expect(btn?.getAttribute('aria-errormessage')).toBeNull();

    fixture.componentInstance.labelText = 'file attachment';
    fixture.componentInstance.required = false;
    fixture.componentInstance.maxFileSize = 50;
    fixture.detectChanges();

    await setupStandardFileChangeEvent();

    expect(btn?.getAttribute('aria-invalid')).toEqual('true');
    expect(btn?.getAttribute('aria-errormessage')).toEqual('MOCK_ID_1');
    expect(
      fixture.nativeElement.querySelector('sky-form-error')?.textContent.trim(),
    ).toBe('Error: Upload a file under 50 bytes.');
  });

  it('should render file errors and NgControl errors when label text is set', async () => {
    const btn = getButtonEl(fixture.nativeElement);
    expect(btn?.getAttribute('aria-invalid')).toEqual('false');
    expect(btn?.getAttribute('aria-errormessage')).toBeNull();

    fixture.componentInstance.labelText = 'file attachment';
    fixture.componentInstance.required = true;
    fixture.componentInstance.maxFileSize = 50;
    fixture.detectChanges();

    const files = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    await triggerDrop(files, getDropDebugEl());

    fixture.componentInstance.attachment.markAsTouched();
    fixture.detectChanges();

    expect(btn?.getAttribute('aria-invalid')).toEqual('true');
    expect(btn?.getAttribute('aria-errormessage')).toEqual('MOCK_ID_1');
    expect(
      fixture.nativeElement
        .querySelectorAll('sky-form-error')[0]
        ?.textContent.trim(),
    ).toBe('Error: file attachment is required.');
    expect(
      fixture.nativeElement
        .querySelectorAll('sky-form-error')[1]
        ?.textContent.trim(),
    ).toBe('Error: Upload a file under 50 bytes.');
  });

  it('should render `labelText` and not label element if `labelText` is set', () => {
    fixture.componentInstance.labelElementText = 'label element';
    fixture.componentInstance.labelText = 'label text';
    fixture.detectChanges();

    validateLabelText('label text');
  });

  it('should not render `labelText` or label element if `labelHidden` is set to true', () => {
    fixture.componentInstance.labelElementText = 'label element';
    fixture.componentInstance.labelText = 'label text';
    fixture.componentInstance.labelHidden = true;
    fixture.detectChanges();

    validateLabelText('');
  });

  it('should render label if `labelText` is set', () => {
    fixture.componentInstance.labelText = 'label text';
    fixture.componentInstance.labelElementText = undefined;
    fixture.detectChanges();

    validateLabelText('label text');
  });

  it('should render label element regardless of `labelHidden` value if `labelText` is not set', () => {
    fixture.componentInstance.labelElementText = 'label element';
    fixture.detectChanges();

    validateLabelText('label element');

    fixture.componentInstance.labelHidden = true;
    fixture.detectChanges();

    validateLabelText('label element');
  });

  it('should mark as dirty when an invalid file is uploaded first', async () => {
    const files = [
      {
        name: 'woo.txt',
        size: 2000,
        type: 'image/png',
      },
    ];
    fixture.componentInstance.maxFileSize = 1000;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(files);
    fixture.detectChanges();

    expect(fixture.componentInstance.attachment.dirty).toBeTrue();
  });

  it('should render help inline with popover only if label text is provided', () => {
    fixture.componentInstance.popoverContent = 'popover content';
    fixture.componentInstance.showLabel = false;
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(0);

    fixture.componentInstance.labelText = 'labelText';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  });

  it('should not render help inline for popover unless popover content is set', () => {
    fixture.componentInstance.popoverTitle = 'popover title';
    fixture.componentInstance.showLabel = false;
    fixture.componentInstance.labelText = 'labelText';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(0);

    fixture.componentInstance.popoverContent = 'popover content';
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelectorAll('sky-help-inline').length,
    ).toBe(1);
  });

  it('should render help inline if help key is set', () => {
    fixture.componentInstance.showLabel = false;
    fixture.componentInstance.labelText = 'labelText';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('sky-help-inline')).toBeFalsy();

    fixture.componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('sky-help-inline')).toBeTruthy();
  });

  it('should set global help config with help key', async () => {
    const helpController = TestBed.inject(SkyHelpTestingController);
    fixture.componentInstance.showLabel = false;
    fixture.componentInstance.labelText = 'labelText';
    fixture.componentInstance.popoverContent = undefined;
    fixture.componentInstance.helpKey = 'index.html';

    fixture.detectChanges();

    const helpInlineButton = fixture.nativeElement.querySelector(
      '.sky-help-inline',
    ) as HTMLElement | undefined;
    helpInlineButton?.click();

    await fixture.whenStable();
    fixture.detectChanges();

    helpController.expectCurrentHelpKey('index.html');
  });

  it('should render hint if `hintText` is set', () => {
    const hintText = 'hint text';
    fixture.componentInstance.hintText = hintText;
    fixture.detectChanges();

    const hintEl = fixture.nativeElement.querySelector(
      '.sky-file-attachment-hint-text',
    );

    expect(hintEl).not.toBeNull();
    expect(hintEl?.textContent.trim()).toBe(hintText);
  });

  it('should have the lg margin class if stacked is true', () => {
    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    const fileAttachment = fixture.nativeElement.querySelector(
      'sky-file-attachment',
    );

    expect(fileAttachment).toHaveClass('sky-form-field-stacked');
  });

  it('should not have the lg margin class if stacked is false', () => {
    const fileAttachment = fixture.nativeElement.querySelector(
      'sky-file-attachment',
    );

    expect(fileAttachment).not.toHaveClass('sky-form-field-stacked');
  });

  it('should mark file attachment as touched when blurred', () => {
    expect(fixture.componentInstance.attachment.touched).toBeFalse();
    const button = getButtonEl(el);
    SkyAppTestUtility.fireDomEvent(button, 'blur');
    fixture.detectChanges();

    expect(fixture.componentInstance.attachment.touched).toBeTrue();
  });
});

describe('File attachment (template-driven)', () => {
  let fixture: ComponentFixture<TemplateDrivenFileAttachmentTestComponent>;
  let fileAttachmentInstance: SkyFileAttachmentComponent;
  let el: HTMLElement;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

  beforeEach(() => {
    mockThemeSvc = {
      settingsChange: new BehaviorSubject<SkyThemeSettingsChange>({
        currentSettings: new SkyThemeSettings(
          SkyTheme.presets.default,
          SkyThemeMode.presets.light,
        ),
        previousSettings: undefined,
      }),
    };

    TestBed.configureTestingModule({
      imports: [FileAttachmentTestComponent],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });

    fixture = TestBed.createComponent(
      TemplateDrivenFileAttachmentTestComponent,
    );

    fixture.detectChanges();

    el = fixture.nativeElement;
    fileAttachmentInstance = fixture.componentInstance.fileAttachmentComponent;
  });

  it('should not have disabled attribute when not disabled', fakeAsync(() => {
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const input = getInputDebugEl(fixture);
    const button = getButtonEl(el);

    expect(input.nativeElement.getAttribute('disabled')).toBeNull();
    expect(button?.getAttribute('disabled')).toBeNull();
  }));

  it(`should have disabled attribute when disabled input is set to true`, fakeAsync(() => {
    fixture.componentInstance.disabled = true;
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const input = getInputDebugEl(fixture);
    const button = getButtonEl(el);

    expect(input.nativeElement.getAttribute('disabled')).not.toBeNull();
    expect(button?.getAttribute('disabled')).not.toBeNull();

    fixture.componentInstance.disabled = false;
    tick();
    fixture.detectChanges();

    expect(input.nativeElement.getAttribute('disabled')).toBeNull();
    expect(button?.getAttribute('disabled')).toBeNull();
  }));
});
