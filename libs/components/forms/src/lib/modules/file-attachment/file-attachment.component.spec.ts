import { DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import {
  SkyTheme,
  SkyThemeMode,
  SkyThemeModule,
  SkyThemeService,
  SkyThemeSettings,
  SkyThemeSettingsChange,
} from '@skyux/theme';

import { BehaviorSubject } from 'rxjs';

import { SkyFileAttachmentComponent } from './file-attachment.component';
import { SkyFileItem } from './file-item';
import { FileAttachmentTestComponent } from './fixtures/file-attachment.component.fixture';
import { FileAttachmentTestModule } from './fixtures/file-attachment.module.fixture';
import { TemplateDrivenFileAttachmentTestComponent } from './fixtures/template-driven-file-attachment.component.fixture';
import { SkyFileAttachmentChange } from './types/file-attachment-change';

function getInputDebugEl(fixture: ComponentFixture<any>): DebugElement {
  return fixture.debugElement.query(By.css('input'));
}

function getButtonEl(el: HTMLElement): HTMLElement {
  return el.querySelector('.sky-file-attachment-btn');
}

describe('File attachment', () => {
  let fixture: ComponentFixture<FileAttachmentTestComponent>;
  let el: HTMLElement;
  let fileAttachmentInstance: SkyFileAttachmentComponent;
  let mockThemeSvc: {
    settingsChange: BehaviorSubject<SkyThemeSettingsChange>;
  };

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
      imports: [FileAttachmentTestModule, SkyThemeModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileAttachmentTestComponent);
    fixture.detectChanges();
    el = fixture.nativeElement;
    fileAttachmentInstance = fixture.componentInstance.fileAttachmentComponent;
  });

  //#region helpers
  function getDropEl(): HTMLElement {
    return el.querySelector('.sky-file-attachment');
  }

  function getDropDebugEl(): DebugElement {
    return fixture.debugElement.query(By.css('.sky-file-attachment'));
  }

  function getFileNameLinkEl(): HTMLElement {
    return el.querySelector('.sky-file-attachment-name a');
  }

  function getFileNameText(): string {
    return el.querySelector('.sky-file-attachment-name').textContent.trim();
  }

  function getDeleteEl(): HTMLElement {
    return el.querySelector('.sky-file-attachment-delete');
  }

  function validateDropClasses(
    hasAccept: boolean,
    hasReject: boolean,
    dropEl: any
  ): void {
    expect(dropEl.classList.contains('sky-file-attachment-accept')).toBe(
      hasAccept
    );
    expect(dropEl.classList.contains('sky-file-attachment-reject')).toBe(
      hasReject
    );
  }

  function getImage(): DebugElement {
    return fixture.debugElement.query(
      By.css('.sky-file-attachment-preview-img')
    );
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
    expect(imageEl.nativeElement.getAttribute('src')).toBe(
      '$/myFile.' + extension
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

  function getLabelWrapper(): HTMLElement {
    return el.querySelector('.sky-file-attachment-label-wrapper');
  }

  function triggerChangeEvent(expectedChangeFiles: any[]): void {
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
  }

  function getFileReaderSpy(): {
    loadCallbacks: ((opts: {
      target: {
        result: string;
      };
    }) => void)[];
    errorCallbacks: (() => void)[];
    abortCallbacks: (() => void)[];
  } {
    const loadCallbacks: ((opts: {
      target: {
        result: string;
      };
    }) => void)[] = [];
    const errorCallbacks: (() => void)[] = [];
    const abortCallbacks: (() => void)[] = [];

    spyOn(window as any, 'FileReader').and.returnValue({
      readAsDataURL: function (): void {},
      addEventListener: function (type, callback): void {
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
    };
  }

  function setupStandardFileChangeEvent(files?: Array<any>): void {
    const fileReaderSpy = getFileReaderSpy();

    if (!files) {
      files = [
        {
          name: 'foo.txt',
          size: 1000,
          type: 'image/png',
        },
      ];
    }
    triggerChangeEvent(files);

    fixture.detectChanges();

    if (fileReaderSpy.loadCallbacks[0]) {
      fileReaderSpy.loadCallbacks[0]({
        target: {
          result: '$/url',
        },
      });
    }

    if (fileReaderSpy.loadCallbacks[1]) {
      fileReaderSpy.loadCallbacks[1]({
        target: {
          result: 'newurl',
        },
      });
    }

    fixture.detectChanges();
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
    files: any[],
    items: any[],
    dropDebugEl: DebugElement
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

  function triggerDrop(files: any[], dropDebugEl: DebugElement): void {
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

  it('should not have required class and aria-reqiured attribute when not required', fakeAsync(() => {
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const labelWrapper = getLabelWrapper();
    const input = getInputDebugEl(fixture);

    expect(input.nativeElement.getAttribute('required')).toBeNull();
    expect(labelWrapper.classList.contains('sky-control-label-required')).toBe(
      false
    );
    expect(labelWrapper.getAttribute('aria-required')).toBeNull();
  }));

  it('should have appropriate classes when file is required', fakeAsync(() => {
    fixture.componentInstance.required = true;
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const labelWrapper = getLabelWrapper();
    const input = getInputDebugEl(fixture);

    expect(input.nativeElement.getAttribute('required')).not.toBeNull();
    expect(labelWrapper.classList.contains('sky-control-label-required')).toBe(
      true
    );
    expect(labelWrapper.getAttribute('aria-required')).toBe('true');
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
    expect(labelWrapper.classList.contains('sky-control-label-required')).toBe(
      true
    );
    expect(labelWrapper.getAttribute('aria-required')).toBe('true');
  }));

  it('should not have disabled attribute when not disabled', fakeAsync(() => {
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const input = getInputDebugEl(fixture);
    const button = getButtonEl(el);

    expect(input.nativeElement.getAttribute('disabled')).toBeNull();
    expect(button.getAttribute('disabled')).toBeNull();
  }));

  it(`should have disabled attribute when form control's disabled method is called`, fakeAsync(() => {
    fixture.componentInstance.attachment.disable();
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const input = getInputDebugEl(fixture);
    const button = getButtonEl(el);

    expect(input.nativeElement.getAttribute('disabled')).not.toBeNull();
    expect(button.getAttribute('disabled')).not.toBeNull();

    fixture.componentInstance.attachment.enable();
    tick();
    fixture.detectChanges();

    expect(input.nativeElement.getAttribute('disabled')).toBeNull();
    expect(button.getAttribute('disabled')).toBeNull();
  }));

  it('should handle removing the label', fakeAsync(() => {
    fixture.componentInstance.required = true;
    fileAttachmentInstance.ngAfterViewInit();
    fileAttachmentInstance.ngAfterContentInit();
    tick();
    fixture.detectChanges();

    const labelWrapper = getLabelWrapper();

    expect(labelWrapper.classList.contains('sky-control-label-required')).toBe(
      true
    );

    fixture.componentInstance.showLabel = false;
    fixture.detectChanges();

    expect(labelWrapper.classList.contains('sky-control-label-required')).toBe(
      false
    );
  }));

  it('should click the file input on choose file button click', () => {
    fixture.detectChanges();

    const inputEl = getInputDebugEl(fixture);

    spyOn(inputEl.references.fileInput, 'click');

    const dropEl = getButtonEl(el);

    expect(inputEl.references.fileInput.click).not.toHaveBeenCalled();

    dropEl.click();

    fixture.detectChanges();

    expect(inputEl.references.fileInput.click).toHaveBeenCalled();
  });

  it('should not click the file input on remove button click', () => {
    fixture.detectChanges();

    const inputEl = getInputDebugEl(fixture);

    spyOn(inputEl.references.fileInput, 'click');

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    setupStandardFileChangeEvent(file);

    const deleteEl = getDeleteEl();

    expect(inputEl.references.fileInput.click).not.toHaveBeenCalled();

    deleteEl.click();

    fixture.detectChanges();

    expect(inputEl.references.fileInput.click).not.toHaveBeenCalled();
  });

  // Maybe some other tests here about dragging
  it('should load and emit file on file change event', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
    );

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file).toBeTruthy();
    expect(fileChangeActual.file.url).toBe('$/url');
    expect(fileChangeActual.file.file.name).toBe('foo.txt');
    expect(fileChangeActual.file.file.size).toBe(1000);
  });

  it('should load and emit files on file change event when file reader has an error and aborts', () => {
    let filesChangedActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (filesChanged: SkyFileAttachmentChange) => {
        filesChangedActual = filesChanged;
      }
    );

    const fileReaderSpy = getFileReaderSpy();

    triggerChangeEvent([
      {
        name: 'woo.txt',
        size: 3000,
      },
    ]);
    fixture.detectChanges();

    fileReaderSpy.abortCallbacks[0]();
    fixture.detectChanges();

    expect(filesChangedActual.file.url).toBeFalsy();
    expect(filesChangedActual.file.file.name).toBe('woo.txt');
    expect(filesChangedActual.file.file.size).toBe(3000);

    triggerChangeEvent([
      {
        name: 'foo.txt',
        size: 2000,
      },
    ]);
    fixture.detectChanges();

    fileReaderSpy.errorCallbacks[1]();
    fixture.detectChanges();

    expect(filesChangedActual.file.url).toBeFalsy();
    expect(filesChangedActual.file.file.name).toBe('foo.txt');
    expect(filesChangedActual.file.file.size).toBe(2000);
  });

  it('should clear file on remove press', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
    );

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    setupStandardFileChangeEvent(file);

    const deleteEl = getDeleteEl();

    deleteEl.click();

    fixture.detectChanges();

    expect(fileChangeActual.file).toBeFalsy();
  });

  it('should show the appropriate file name', () => {
    // Regular file
    let testFile = {
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
      el.querySelector('.sky-file-attachment-name > a').getAttribute('title')
    ).toBe(
      'abcdefghijklmnopqrstuvwxyz12345.png',
      'Expected the anchor title to display the full file name.'
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

    expect(getFileNameText()).toBe('No file chosen');
    expect(fileAttachmentInstance.getFileName()).toBeUndefined();

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

    fileNameEl.click();

    expect(fileAttachmentInstance.fileClick.emit).toHaveBeenCalledWith({
      file: testFile,
    });
  });

  it('should load files and set classes on drag and drop', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
    );

    const fileReaderSpy = getFileReaderSpy();

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

    triggerDrop(files, dropDebugEl);
    validateDropClasses(false, false, dropEl);

    fileReaderSpy.loadCallbacks[0]({
      target: {
        result: '$/url',
      },
    });

    fixture.detectChanges();

    expect(fileChangeActual.file).toBeTruthy();
    expect(fileChangeActual.file.errorType).toBeFalsy();
    expect(fileChangeActual.file.url).toBe('$/url');
    expect(fileChangeActual.file.file.name).toBe('foo.txt');
    expect(fileChangeActual.file.file.size).toBe(1000);

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

  it(
    'should accept a file of rejected type on drag (but not on drop) ' +
      'if the browser does not support dataTransfer.items',
    () => {
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

      triggerDrop(invalidFiles, dropDebugEl);
      validateDropClasses(false, false, dropEl);
    }
  );

  it('should prevent loading multiple files on drag and drop', () => {
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

    const fileReaderSpy = getFileReaderSpy();

    const dropDebugEl = getDropDebugEl();

    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, files, dropDebugEl);
    triggerDrop(files, dropDebugEl);
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it('should prevent loading directories on drag and drop', () => {
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

    const fileReaderSpy = getFileReaderSpy();
    fixture.detectChanges();

    const dropDebugEl = getDropDebugEl();

    triggerDragEnter('sky-file-attachment', dropDebugEl);
    triggerDragOver(undefined, files, dropDebugEl);
    triggerDrop(files, dropDebugEl);
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it('should allow the user to specify a min file size', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
    );

    fileAttachmentInstance.minFileSize = 1500;
    fixture.detectChanges();

    setupStandardFileChangeEvent();

    expect(fileChangeActual.file.file.name).toBe('foo.txt');
    expect(fileChangeActual.file.file.size).toBe(1000);
    expect(fileChangeActual.file.errorType).toBe('minFileSize');
    expect(fileChangeActual.file.errorParam).toBe('1500');

    expect(fileAttachmentInstance.value).toBeFalsy();
  });

  it('should allow the user to specify a max file size', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
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

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('woo.txt');
    expect(fileChangeActual.file.file.size).toBe(2000);
    expect(fileChangeActual.file.errorType).toBe('maxFileSize');
    expect(fileChangeActual.file.errorParam).toBe('1500');

    expect(fileAttachmentInstance.value).toBeFalsy();
  });

  it('should set errors if file fails user provided validation function', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
    );

    const errorMessage =
      'You may not upload a file that begins with the letter "w."';

    fileAttachmentInstance.validateFn = function (inputFile: any): string {
      if (inputFile.file.name.indexOf('w') === 0) {
        return errorMessage;
      }
    };

    fixture.detectChanges();

    const file = [
      {
        name: 'woo.txt',
        size: 2000,
        type: 'image/png',
      },
    ];

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('woo.txt');
    expect(fileChangeActual.file.file.size).toBe(2000);
    expect(fileChangeActual.file.errorType).toBe('validate');
    expect(fileChangeActual.file.errorParam).toBe(errorMessage);

    expect(fileAttachmentInstance.value).toBeFalsy();
  });

  it('should accept if file passes user provided validation function', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
    );

    const errorMessage =
      'You may not upload a file that begins with the letter "w."';

    fileAttachmentInstance.validateFn = function (inputFile: any): string {
      if (inputFile.file.name.indexOf('w') === 0) {
        return errorMessage;
      }
    };

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
      },
    ];

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('foo.txt');
    expect(fileChangeActual.file.file.size).toBe(1000);
    expect(fileChangeActual.file.url).toBe('$/url');

    expect(fileAttachmentInstance.value).toBeTruthy();
  });

  it('should accept a file when type is accepted', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
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

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('foo.txt');
    expect(fileChangeActual.file.file.size).toBe(1000);
    expect(fileChangeActual.file.url).toBe('$/url');
  });

  it('should reject a file with a type that is not accepted', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
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

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('woo.txt');
    expect(fileChangeActual.file.file.size).toBe(2000);
    expect(fileChangeActual.file.errorType).toBe('fileType');
    expect(fileChangeActual.file.errorParam).toBe(
      fileAttachmentInstance.acceptedTypes
    );
  });

  it('should reject a file with no type when accepted types are defined', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
    );

    fileAttachmentInstance.acceptedTypes = 'image/png,image/tiff';

    fixture.detectChanges();

    const file = [
      {
        name: 'foo.txt',
        size: 1000,
      },
    ];

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('foo.txt');
    expect(fileChangeActual.file.file.size).toBe(1000);
    expect(fileChangeActual.file.errorType).toBe('fileType');
    expect(fileChangeActual.file.errorParam).toBe(
      fileAttachmentInstance.acceptedTypes
    );
  });

  it('should allow the user to specify accepted type with wildcards', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
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

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('woo.txt');
    expect(fileChangeActual.file.file.size).toBe(2000);
    expect(fileChangeActual.file.url).toBe('$/url');
  });

  it('should accept multiple types using a wildcard', () => {
    let fileChangeActual: SkyFileAttachmentChange;

    fileAttachmentInstance.fileChange.subscribe(
      (fileChange: SkyFileAttachmentChange) => (fileChangeActual = fileChange)
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

    setupStandardFileChangeEvent(file);

    expect(fileChangeActual.file.file.name).toBe('foo.txt');
    expect(fileChangeActual.file.file.size).toBe(1000);
    expect(fileChangeActual.file.url).toBe('$/url');
  });

  it('shows the thumbnail if the item is an image', async(() => {
    testImage('png');
    testImage('bmp');
    testImage('jpeg');
    testImage('gif');
  }));

  it('does not show an icon if it is not an image', async(() => {
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
  }));

  it('should not show an icon if file or type does not exist', () => {
    const imageEl = getImage();
    expect(imageEl).toBeFalsy();

    fileAttachmentInstance.value = {
      file: undefined,
      url: '$/myFile',
    } as SkyFileItem;
    fixture.detectChanges();

    expect(imageEl).toBeFalsy();

    fileAttachmentInstance.value = {
      file: {
        name: 'myFile.png',
        type: undefined,
        size: 1000,
      },
      url: '$/myFile',
    } as SkyFileItem;
    fixture.detectChanges();

    expect(imageEl).toBeFalsy();
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(async () => {
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  }));

  it('should pass accessibility when label does not match the button text', async(() => {
    fixture.componentInstance.labelText = 'Something different';
    fixture.detectChanges();
    fixture.whenStable().then(async () => {
      await expectAsync(fixture.nativeElement).toBeAccessible();
    });
  }));
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
          SkyThemeMode.presets.light
        ),
        previousSettings: undefined,
      }),
    };
    TestBed.configureTestingModule({
      imports: [FileAttachmentTestModule],
      providers: [
        {
          provide: SkyThemeService,
          useValue: mockThemeSvc,
        },
      ],
    });
    fixture = TestBed.createComponent(
      TemplateDrivenFileAttachmentTestComponent
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
    expect(button.getAttribute('disabled')).toBeNull();
  }));

  it(`should have disabled attribute when disabled input is set to true`, fakeAsync(() => {
    fixture.componentInstance.disabled = true;
    fileAttachmentInstance.ngAfterViewInit();
    tick();
    fixture.detectChanges();
    const input = getInputDebugEl(fixture);
    const button = getButtonEl(el);

    expect(input.nativeElement.getAttribute('disabled')).not.toBeNull();
    expect(button.getAttribute('disabled')).not.toBeNull();

    fixture.componentInstance.disabled = false;
    tick();
    fixture.detectChanges();

    expect(input.nativeElement.getAttribute('disabled')).toBeNull();
    expect(button.getAttribute('disabled')).toBeNull();
  }));
});
