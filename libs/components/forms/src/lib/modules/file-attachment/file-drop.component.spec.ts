import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SkyAppTestUtility, expect } from '@skyux-sdk/testing';

import { SkyFileAttachmentsModule } from './file-attachments.module';
import { SkyFileDropComponent } from './file-drop.component';
import { SkyFileLink } from './file-link';
import { SkyFileDropChange } from './types/file-drop-change';

describe('File drop component', () => {
  /** Simple test component with tabIndex */
  @Component({
    template: ` <sky-file-drop>
      <div class="sky-custom-drop"></div>
    </sky-file-drop>`,
  })
  class FileDropContentComponent {}

  let fixture: ComponentFixture<SkyFileDropComponent>;
  let el: any;
  let componentInstance: SkyFileDropComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyFileAttachmentsModule],
      declarations: [FileDropContentComponent],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyFileDropComponent);
    el = fixture.nativeElement;
    componentInstance = fixture.componentInstance;
  });

  //#region helper functions
  function getInputDebugEl() {
    return fixture.debugElement.query(By.css('input.sky-file-input-hidden'));
  }

  function getDropEl() {
    return el.querySelector('.sky-file-drop');
  }

  function getDropDebugEl() {
    return fixture.debugElement.query(By.css('.sky-file-drop'));
  }

  function getDropElWrapper() {
    return el.querySelector('.sky-file-drop-col');
  }

  function validateDropClasses(
    hasAccept: boolean,
    hasReject: boolean,
    dropEl: any
  ) {
    expect(dropEl.classList.contains('sky-file-drop-accept')).toBe(hasAccept);
    expect(dropEl.classList.contains('sky-file-drop-reject')).toBe(hasReject);
  }

  function getLinkInput() {
    return fixture.debugElement.query(By.css('.sky-file-drop-link input'));
  }

  function getLinkButton() {
    return fixture.debugElement.query(By.css('.sky-file-drop-link button'));
  }

  function testClick(expectedResult: boolean) {
    let inputClicked = false;

    fixture.detectChanges();

    const inputEl = getInputDebugEl();

    spyOn(inputEl.references.fileInput, 'click').and.callFake(function () {
      inputClicked = true;
    });

    const dropEl = getDropEl();

    dropEl.click();

    fixture.detectChanges();

    expect(inputClicked).toBe(expectedResult);
  }

  function triggerChangeEvent(expectedChangeFiles: any[]) {
    const inputEl = getInputDebugEl();

    const fileChangeEvent = {
      target: {
        files: {
          length: expectedChangeFiles.length,
          item: function (index: number) {
            return expectedChangeFiles[index];
          },
        },
      },
    };

    inputEl.triggerEventHandler('change', fileChangeEvent);
  }

  function setupFileReaderSpy() {
    const loadCallbacks: Function[] = [];
    const errorCallbacks: Function[] = [];
    const abortCallbacks: Function[] = [];

    spyOn(window as any, 'FileReader').and.returnValue({
      readAsDataURL: function (file: any) {},
      addEventListener: function (type: string, callback: Function) {
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
      loadCallbacks: loadCallbacks,
      errorCallbacks: errorCallbacks,
      abortCallbacks: abortCallbacks,
    };
  }

  function setupStandardFileChangeEvent(files?: any[]) {
    const fileReaderSpy = setupFileReaderSpy();

    if (!files) {
      files = [
        {
          name: 'foo.txt',
          size: 1000,
          type: 'image/png',
        },
        {
          name: 'woo.txt',
          size: 2000,
          type: 'image/jpeg',
        },
      ];
    }
    triggerChangeEvent(files);

    fixture.detectChanges();

    if (fileReaderSpy.loadCallbacks[0]) {
      fileReaderSpy.loadCallbacks[0]({
        target: {
          result: 'url',
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

  function triggerDragEnter(enterTarget: any, dropDebugEl: DebugElement) {
    let dragEnterPropStopped = false;
    let dragEnterPreventDefault = false;

    const dragEnterEvent = {
      target: enterTarget,
      stopPropagation: function () {
        dragEnterPropStopped = true;
      },
      preventDefault: function () {
        dragEnterPreventDefault = true;
      },
    };

    dropDebugEl.triggerEventHandler('dragenter', dragEnterEvent);
    fixture.detectChanges();
    expect(dragEnterPreventDefault).toBe(true);
    expect(dragEnterPropStopped).toBe(true);
  }

  function triggerDragOver(files: any, dropDebugEl: DebugElement) {
    let dragOverPropStopped = false;
    let dragOverPreventDefault = false;

    const dragOverEvent = {
      dataTransfer: {
        files: {} as any,
        items: files,
      },
      stopPropagation: function () {
        dragOverPropStopped = true;
      },
      preventDefault: function () {
        dragOverPreventDefault = true;
      },
    };

    dropDebugEl.triggerEventHandler('dragover', dragOverEvent);
    fixture.detectChanges();
    expect(dragOverPreventDefault).toBe(true);
    expect(dragOverPropStopped).toBe(true);
  }

  function triggerDrop(files: any, dropDebugEl: DebugElement) {
    let dropPropStopped = false;
    let dropPreventDefault = false;
    const fileLength = files ? files.length : 0;

    const dropEvent = {
      dataTransfer: {
        files: {
          length: fileLength,
          item: function (index: number) {
            return files[index];
          },
        },
        items: files,
      },
      stopPropagation: function () {
        dropPropStopped = true;
      },
      preventDefault: function () {
        dropPreventDefault = true;
      },
    };

    dropDebugEl.triggerEventHandler('drop', dropEvent);
    fixture.detectChanges();
    expect(dropPreventDefault).toBe(true);
    expect(dropPropStopped).toBe(true);
  }

  function triggerDragLeave(leaveTarget: any, dropDebugEl: DebugElement) {
    const dragLeaveEvent = {
      target: leaveTarget,
    };

    dropDebugEl.triggerEventHandler('dragleave', dragLeaveEvent);
    fixture.detectChanges();
  }

  function triggerInputChange(value: string, linkInput: DebugElement) {
    linkInput.triggerEventHandler('input', { target: { value: value } });
    fixture.detectChanges();
  }
  //#endregion

  it('should create the file drop control', () => {
    fixture.detectChanges();

    const dropEl = getDropEl();

    expect(dropEl).toBeTruthy();
    validateDropClasses(false, false, dropEl);

    const inputEl = getInputDebugEl();
    expect(inputEl.references.fileInput).toBeTruthy();
  });

  it('should click the file input on file drop click', () => {
    testClick(true);
  });

  it('should prevent click when noclick is specified', () => {
    componentInstance.noClick = true;
    fixture.detectChanges();
    testClick(false);
  });

  it('should load and emit files on file change event', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    setupStandardFileChangeEvent();

    expect(filesChangedActual.files.length).toBe(2);
    expect(filesChangedActual.files[0].url).toBe('url');
    expect(filesChangedActual.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(1000);

    expect(filesChangedActual.files[1].url).toBe('newurl');
    expect(filesChangedActual.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual.files[1].file.size).toBe(2000);
  });

  it('should load and emit files on file change event when file reader has an error and aborts', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    const fileReaderSpy = setupFileReaderSpy();

    triggerChangeEvent([
      {
        name: 'foo.txt',
        size: 1000,
      },
      {
        name: 'woo.txt',
        size: 2000,
      },
      {
        name: 'goo.txt',
        size: 3000,
      },
    ]);

    fixture.detectChanges();

    fileReaderSpy.abortCallbacks[0]();

    fileReaderSpy.loadCallbacks[1]({
      target: {
        result: 'anotherurl',
      },
    });

    fileReaderSpy.errorCallbacks[2]();

    fixture.detectChanges();

    expect(filesChangedActual.files.length).toBe(1);
    expect(filesChangedActual.files[0].url).toBe('anotherurl');
    expect(filesChangedActual.files[0].file.name).toBe('woo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(2000);

    expect(filesChangedActual.rejectedFiles.length).toBe(2);

    expect(filesChangedActual.rejectedFiles[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.rejectedFiles[0].file.size).toBe(1000);

    expect(filesChangedActual.rejectedFiles[1].file.name).toBe('goo.txt');
    expect(filesChangedActual.rejectedFiles[1].file.size).toBe(3000);
  });

  it('should allow the user to specify to not allow multiple files', () => {
    componentInstance.multiple = false;
    fixture.detectChanges();
    const inputEl = getInputDebugEl();

    expect(inputEl.nativeElement.hasAttribute('multiple')).toBe(false);

    componentInstance.multiple = true;
    fixture.detectChanges();
    expect(inputEl.nativeElement.hasAttribute('multiple')).toBe(true);
  });

  it('should set accepted types on the file input html', () => {
    componentInstance.acceptedTypes = 'image/png';
    fixture.detectChanges();
    const inputEl = getInputDebugEl();

    expect(inputEl.nativeElement.getAttribute('accept')).toBe('image/png');
  });

  it('should allow the user to specify a min file size', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    componentInstance.minFileSize = 1500;
    fixture.detectChanges();

    setupStandardFileChangeEvent();

    expect(filesChangedActual.rejectedFiles.length).toBe(1);
    expect(filesChangedActual.rejectedFiles[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.rejectedFiles[0].file.size).toBe(1000);
    expect(filesChangedActual.rejectedFiles[0].errorType).toBe('minFileSize');
    expect(filesChangedActual.rejectedFiles[0].errorParam).toBe('1500');

    expect(filesChangedActual.files.length).toBe(1);
    expect(filesChangedActual.files[0].url).toBe('url');
    expect(filesChangedActual.files[0].file.name).toBe('woo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(2000);
  });

  it('should allow the user to specify a max file size', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    componentInstance.maxFileSize = 1500;
    fixture.detectChanges();

    setupStandardFileChangeEvent();

    expect(filesChangedActual.rejectedFiles.length).toBe(1);
    expect(filesChangedActual.rejectedFiles[0].file.name).toBe('woo.txt');
    expect(filesChangedActual.rejectedFiles[0].file.size).toBe(2000);
    expect(filesChangedActual.rejectedFiles[0].errorType).toBe('maxFileSize');
    expect(filesChangedActual.rejectedFiles[0].errorParam).toBe('1500');

    expect(filesChangedActual.files.length).toBe(1);
    expect(filesChangedActual.files[0].url).toBe('url');
    expect(filesChangedActual.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(1000);
  });

  it('should allow the user to specify a validation function', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    const errorMessage =
      'You may not upload a file that begins with the letter "w."';

    componentInstance.validateFn = function (file: any) {
      if (file.file.name.indexOf('w') === 0) {
        return errorMessage;
      }
    };

    fixture.detectChanges();

    setupStandardFileChangeEvent();

    expect(filesChangedActual.rejectedFiles.length).toBe(1);
    expect(filesChangedActual.rejectedFiles[0].file.name).toBe('woo.txt');
    expect(filesChangedActual.rejectedFiles[0].file.size).toBe(2000);
    expect(filesChangedActual.rejectedFiles[0].errorType).toBe('validate');
    expect(filesChangedActual.rejectedFiles[0].errorParam).toBe(errorMessage);

    expect(filesChangedActual.files.length).toBe(1);
    expect(filesChangedActual.files[0].url).toBe('url');
    expect(filesChangedActual.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(1000);
  });

  it('should allow the user to specify accepted types', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    componentInstance.acceptedTypes = 'image/png,image/tiff';

    fixture.detectChanges();

    setupStandardFileChangeEvent();

    expect(filesChangedActual.rejectedFiles.length).toBe(1);
    expect(filesChangedActual.rejectedFiles[0].file.name).toBe('woo.txt');
    expect(filesChangedActual.rejectedFiles[0].file.size).toBe(2000);
    expect(filesChangedActual.rejectedFiles[0].errorType).toBe('fileType');
    expect(filesChangedActual.rejectedFiles[0].errorParam).toBe(
      componentInstance.acceptedTypes
    );

    expect(filesChangedActual.files.length).toBe(1);
    expect(filesChangedActual.files[0].url).toBe('url');
    expect(filesChangedActual.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(1000);
  });

  it('should reject a file with no type when accepted types are defined', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    componentInstance.acceptedTypes = 'image/png,image/tiff';

    fixture.detectChanges();

    const files = [
      {
        name: 'foo.txt',
        size: 1000,
      },
      {
        name: 'woo.txt',
        size: 2000,
        type: 'image/jpeg',
      },
    ];

    setupStandardFileChangeEvent(files);

    expect(filesChangedActual.rejectedFiles.length).toBe(2);
    expect(filesChangedActual.rejectedFiles[1].file.name).toBe('woo.txt');
    expect(filesChangedActual.rejectedFiles[1].file.size).toBe(2000);
    expect(filesChangedActual.rejectedFiles[1].errorType).toBe('fileType');
    expect(filesChangedActual.rejectedFiles[1].errorParam).toBe(
      componentInstance.acceptedTypes
    );

    expect(filesChangedActual.rejectedFiles[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.rejectedFiles[0].file.size).toBe(1000);
    expect(filesChangedActual.rejectedFiles[0].errorType).toBe('fileType');
    expect(filesChangedActual.rejectedFiles[0].errorParam).toBe(
      componentInstance.acceptedTypes
    );
  });

  it('should allow the user to specify accepted type with wildcards', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    componentInstance.acceptedTypes = 'application/*,image/*';

    fixture.detectChanges();

    setupStandardFileChangeEvent();

    expect(filesChangedActual.rejectedFiles.length).toBe(0);

    expect(filesChangedActual.files.length).toBe(2);
    expect(filesChangedActual.files[0].url).toBe('url');
    expect(filesChangedActual.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(1000);
    expect(filesChangedActual.files[1].url).toBe('newurl');
    expect(filesChangedActual.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual.files[1].file.size).toBe(2000);
  });

  it('should load files and set classes on drag and drop', () => {
    let filesChangedActual: SkyFileDropChange;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged)
    );

    const fileReaderSpy = setupFileReaderSpy();

    componentInstance.acceptedTypes = 'image/png, image/tiff';

    fixture.detectChanges();

    const dropDebugEl = getDropDebugEl();

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

    triggerDragEnter('sky-drop', dropDebugEl);
    triggerDragOver(files, dropDebugEl);
    const dropElWrapper = getDropElWrapper();

    validateDropClasses(true, false, dropElWrapper);

    triggerDrop(files, dropDebugEl);

    validateDropClasses(false, false, dropElWrapper);

    fileReaderSpy.loadCallbacks[0]({
      target: {
        result: 'url',
      },
    });

    fixture.detectChanges();

    expect(filesChangedActual.rejectedFiles.length).toBe(0);
    expect(filesChangedActual.files.length).toBe(1);
    expect(filesChangedActual.files[0].url).toBe('url');
    expect(filesChangedActual.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual.files[0].file.size).toBe(1000);

    // Verify reject classes when appropriate
    triggerDragEnter('sky-drop', dropDebugEl);
    triggerDragOver(invalidFiles, dropDebugEl);
    validateDropClasses(false, true, dropElWrapper);
    triggerDragLeave('something', dropDebugEl);
    validateDropClasses(false, true, dropElWrapper);
    triggerDragLeave('sky-drop', dropDebugEl);
    validateDropClasses(false, false, dropElWrapper);

    // Verify empty file array
    triggerDragEnter('sky-drop', dropDebugEl);
    triggerDragOver([], dropDebugEl);
    validateDropClasses(false, false, dropElWrapper);

    const emptyEvent = {
      stopPropagation: function () {},
      preventDefault: function () {},
    };

    // Verify no dataTransfer drag
    dropDebugEl.triggerEventHandler('dragover', emptyEvent);
    fixture.detectChanges();
    validateDropClasses(false, false, dropElWrapper);

    // Verify no dataTransfer drop
    fileReaderSpy.loadCallbacks = [];
    dropDebugEl.triggerEventHandler('drop', emptyEvent);
    fixture.detectChanges();
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it(
    [
      'should accept a file of rejected type on drag (but not on drop)',
      'if the browser does not support dataTransfer.items',
    ].join(' '),
    () => {
      componentInstance.acceptedTypes = 'image/png, image/tiff';

      fixture.detectChanges();

      const dropDebugEl = getDropDebugEl();

      const invalidFiles = [
        {
          name: 'foo.txt',
          size: 1000,
          type: 'image/jpeg',
        },
      ];

      const dropElWrapper = getDropElWrapper();

      triggerDragEnter('sky-drop', dropDebugEl);
      triggerDragOver(undefined, dropDebugEl);
      validateDropClasses(true, false, dropElWrapper);

      triggerDrop(invalidFiles, dropDebugEl);
      validateDropClasses(false, false, dropElWrapper);
    }
  );

  it('should allow loading multiple files on drag and drop when multiple is true', () => {
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

    const fileReaderSpy = setupFileReaderSpy();

    componentInstance.multiple = true;
    fixture.detectChanges();

    const dropDebugEl = getDropDebugEl();

    triggerDragEnter('sky-drop', dropDebugEl);
    triggerDragOver(files, dropDebugEl);
    triggerDrop(files, dropDebugEl);
    expect(fileReaderSpy.loadCallbacks.length).toBe(2);
  });

  it('should prevent loading multiple files on drag and drop when multiple is false', () => {
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

    const fileReaderSpy = setupFileReaderSpy();

    componentInstance.multiple = false;
    fixture.detectChanges();

    const dropDebugEl = getDropDebugEl();

    triggerDragEnter('sky-drop', dropDebugEl);
    triggerDragOver(files, dropDebugEl);
    triggerDrop(files, dropDebugEl);
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it('should prevent loading directories on drag and drop', () => {
    const files = [
      {
        name: 'foo.txt',
        size: 1000,
        type: 'image/png',
        webkitGetAsEntry: function () {
          return {
            isDirectory: true,
          };
        },
      },
    ];

    const fileReaderSpy = setupFileReaderSpy();
    fixture.detectChanges();

    const dropDebugEl = getDropDebugEl();

    triggerDragEnter('sky-drop', dropDebugEl);
    triggerDragOver(files, dropDebugEl);
    triggerDrop(files, dropDebugEl);
    expect(fileReaderSpy.loadCallbacks.length).toBe(0);
  });

  it('should show link section when allowLinks is true', () => {
    componentInstance.allowLinks = true;
    fixture.detectChanges();

    const linkInput = getLinkInput();

    expect(linkInput).toBeTruthy();
  });

  it('should emit the `linkInputBlur` event whenever the link input is blurred', fakeAsync(() => {
    componentInstance.allowLinks = true;
    fixture.detectChanges();

    const blurEventSpy = spyOn(componentInstance.linkInputBlur, 'emit');

    componentInstance.linkInputBlur.subscribe(() => {
      expect(blurEventSpy).toHaveBeenCalled();
    });

    const linkInput = getLinkInput();

    SkyAppTestUtility.fireDomEvent(linkInput.nativeElement, 'blur');

    fixture.detectChanges();
  }));

  it('should emit link event when link is added on click', () => {
    let fileLinkActual: SkyFileLink;

    componentInstance.linkChanged.subscribe(
      (newLink: SkyFileLink) => (fileLinkActual = newLink)
    );

    componentInstance.allowLinks = true;
    fixture.detectChanges();

    const linkInput = getLinkInput();

    triggerInputChange('link.com', linkInput);

    const linkButton = getLinkButton();
    linkButton.nativeElement.click();
    fixture.detectChanges();

    expect(fileLinkActual.url).toBe('link.com');
  });

  it('should emit link event when link is added on enter press', () => {
    let fileLinkActual: SkyFileLink;

    componentInstance.linkChanged.subscribe(
      (newLink: SkyFileLink) => (fileLinkActual = newLink)
    );

    componentInstance.allowLinks = true;
    fixture.detectChanges();

    const linkInput = getLinkInput();

    triggerInputChange('link.com', linkInput);

    linkInput.triggerEventHandler('keyup', {
      which: 23,
      preventDefault: function () {},
    });
    fixture.detectChanges();

    expect(fileLinkActual).toBeFalsy();

    linkInput.triggerEventHandler('keyup', {
      which: 13,
      preventDefault: function () {},
    });
    fixture.detectChanges();

    expect(fileLinkActual.url).toBe('link.com');
  });

  it('should allow custom content inside of the file drop component', () => {
    const contentFixture = TestBed.createComponent(FileDropContentComponent);

    contentFixture.detectChanges();

    expect(
      contentFixture.debugElement.query(By.css('.sky-file-drop-contents'))
    ).toBeFalsy();
    expect(
      contentFixture.debugElement.query(
        By.css('.sky-file-drop-contents-custom .sky-custom-drop')
      )
    ).toBeTruthy();
  });

  it('Should specify type="button" on all button elements.', () => {
    fixture.detectChanges();
    expect(el.querySelectorAll('button:not([type])').length).toBe(0);
    expect(el.querySelectorAll('button[type="submit"]').length).toBe(0);
    expect(el.querySelectorAll('button[type="button"]').length).toBe(1);
  });

  it('should set aria-labels correctly', () => {
    componentInstance.allowLinks = true;
    fixture.detectChanges();

    const linkInput: DebugElement = getLinkInput();
    const dropEl: HTMLElement = getDropEl();

    expect(
      linkInput.nativeElement.attributes.getNamedItem('aria-label').value
    ).toBe('Add a link to a file');
    expect(dropEl.attributes.getNamedItem('aria-label').value).toBe(
      'Drag a file here or click to browse'
    );

    componentInstance.fileUploadAriaLabel = 'Test 12';
    componentInstance.linkUploadAriaLabel = 'Test 34';

    fixture.detectChanges();

    expect(
      linkInput.nativeElement.attributes.getNamedItem('aria-label').value
    ).toBe('Test 34');
    expect(dropEl.attributes.getNamedItem('aria-label').value).toBe('Test 12');
  });

  it('should pass accessibility', async(() => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.nativeElement).toBeAccessible();
    });
  }));
});
