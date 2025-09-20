import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SkyAppTestUtility, expect, expectAsync } from '@skyux-sdk/testing';
import { SkyIdService, SkyLiveAnnouncerService } from '@skyux/core';
import {
  SkyHelpTestingController,
  SkyHelpTestingModule,
  provideSkyFileReaderTesting,
} from '@skyux/core/testing';

import { SkyFileItem } from '../shared/file-item';

import { SkyFileDropChange } from './file-drop-change';
import { SkyFileDropComponent } from './file-drop.component';
import { SkyFileDropModule } from './file-drop.module';
import { SkyFileLink } from './file-link';
import { ReactiveFileDropTestComponent } from './fixtures/reactive-file-drop.component.fixture';

describe('File drop component', () => {
  /** Simple test component with tabIndex */
  @Component({
    imports: [SkyFileDropModule],
    template: ` <sky-file-drop>
      <div class="sky-custom-drop"></div>
    </sky-file-drop>`,
  })
  class FileDropContentComponent {}

  let fixture: ComponentFixture<SkyFileDropComponent>;
  let el: any;
  let componentInstance: SkyFileDropComponent;

  let liveAnnouncerSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        FileDropContentComponent,
        SkyFileDropModule,
        SkyHelpTestingModule,
        NoopAnimationsModule,
      ],
    });

    let uniqueId = 0;
    spyOn(TestBed.inject(SkyIdService), 'generateId').and.callFake(
      () => `MOCK_ID_${++uniqueId}`,
    );

    fixture = TestBed.createComponent(SkyFileDropComponent);
    fixture.detectChanges();

    el = fixture.nativeElement;
    componentInstance = fixture.componentInstance;

    liveAnnouncerSpy = spyOn(
      TestBed.inject(SkyLiveAnnouncerService),
      'announce',
    );
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  //#region helper functions
  function getInputDebugEl(): DebugElement {
    return fixture.debugElement.query(By.css('input.sky-file-input-hidden'));
  }

  function getLabelEl(): HTMLElement | null {
    return el.querySelector('legend.sky-control-label');
  }

  function getDropEl(): HTMLElement | null {
    return el.querySelector('.sky-file-drop');
  }

  function getDropDebugEl(): DebugElement {
    return fixture.debugElement.query(By.css('.sky-file-drop'));
  }

  function getDropElWrapper(): HTMLElement | null {
    return el.querySelector('.sky-file-drop-col');
  }

  function getHintEl(): HTMLElement | null {
    return el.querySelector('.sky-file-drop-hint-text');
  }

  function validateDropClasses(
    hasAccept: boolean,
    hasReject: boolean,
    dropEl: any,
  ): void {
    expect(dropEl.classList.contains('sky-file-drop-accept')).toBe(hasAccept);
    expect(dropEl.classList.contains('sky-file-drop-reject')).toBe(hasReject);
  }

  function getLinkInput(): DebugElement {
    return fixture.debugElement.query(By.css('.sky-file-drop-link input'));
  }

  function getLinkButton(): DebugElement {
    return fixture.debugElement.query(By.css('.sky-file-drop-link button'));
  }

  function testClick(expectedResult: boolean): void {
    let inputClicked = false;

    fixture.detectChanges();

    const inputEl = getInputDebugEl();

    spyOn(inputEl.references['fileInput'], 'click').and.callFake(function () {
      inputClicked = true;
    });

    const dropEl = getDropEl();

    dropEl?.click();

    fixture.detectChanges();

    expect(inputClicked).toBe(expectedResult);
  }

  function triggerChangeEvent(expectedChangeFiles: any[]): void {
    const inputEl = getInputDebugEl();

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

  function setupFileReaderSpy(existingSpy?: jasmine.Spy): {
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
      readAsDataURL: function () {
        return;
      },
      addEventListener: function (type: string, callback: () => void) {
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
      fileReaderSpy: fileReaderSpy,
    };
  }

  async function setupStandardFileChangeEvent(
    files?: any[],
    existingSpy?: jasmine.Spy,
  ): Promise<jasmine.Spy> {
    const fileReaderSpyData = setupFileReaderSpy(existingSpy);

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
    await fixture.whenStable();

    jasmine.clock().tick(501);

    fixture.detectChanges();
    await fixture.whenStable();

    if (fileReaderSpyData.loadCallbacks[0]) {
      fileReaderSpyData.loadCallbacks[0]({
        target: {
          result: 'url',
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

  async function setupErrorFileChangeEvent(
    files?: any[],
    existingSpy?: jasmine.Spy,
  ): Promise<jasmine.Spy> {
    const fileReaderSpyData = setupFileReaderSpy(existingSpy);

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
        {
          name: 'bar.jpeg',
          size: 4000,
          type: 'image/jpeg',
        },
        {
          name: 'bat.pdf',
          size: 2000,
          type: 'pdf',
        },
      ];
    }
    triggerChangeEvent(files);

    fixture.detectChanges();
    await fixture.whenStable();

    jasmine.clock().tick(501);

    fixture.detectChanges();
    await fixture.whenStable();

    if (fileReaderSpyData.loadCallbacks[0]) {
      fileReaderSpyData.loadCallbacks[0]({
        target: {
          result: 'url',
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
    let dragEnterPropStopped = false;
    let dragEnterPreventDefault = false;

    const dragEnterEvent = {
      target: enterTarget,
      stopPropagation: function (): void {
        dragEnterPropStopped = true;
      },
      preventDefault: function (): void {
        dragEnterPreventDefault = true;
      },
    };

    dropDebugEl.triggerEventHandler('dragenter', dragEnterEvent);
    fixture.detectChanges();
    expect(dragEnterPreventDefault).toBe(true);
    expect(dragEnterPropStopped).toBe(true);
  }

  function triggerDragOver(files: any, dropDebugEl: DebugElement): void {
    let dragOverPropStopped = false;
    let dragOverPreventDefault = false;

    const dragOverEvent = {
      dataTransfer: {
        files: {} as any,
        items: files,
      },
      stopPropagation: function (): void {
        dragOverPropStopped = true;
      },
      preventDefault: function (): void {
        dragOverPreventDefault = true;
      },
    };

    dropDebugEl.triggerEventHandler('dragover', dragOverEvent);
    fixture.detectChanges();
    expect(dragOverPreventDefault).toBe(true);
    expect(dragOverPropStopped).toBe(true);
  }

  function triggerDrop(
    fixture: ComponentFixture<any>,
    files: any,
    dropDebugEl: DebugElement,
  ): void {
    let dropPropStopped = false;
    let dropPreventDefault = false;
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
      stopPropagation: function (): void {
        dropPropStopped = true;
      },
      preventDefault: function (): void {
        dropPreventDefault = true;
      },
    };

    dropDebugEl.triggerEventHandler('drop', dropEvent);
    fixture.detectChanges();
    expect(dropPreventDefault).toBe(true);
    expect(dropPropStopped).toBe(true);
  }

  function triggerDragLeave(leaveTarget: any, dropDebugEl: DebugElement): void {
    const dragLeaveEvent = {
      target: leaveTarget,
    };

    dropDebugEl.triggerEventHandler('dragleave', dragLeaveEvent);
    fixture.detectChanges();
  }

  function triggerInputChange(value: string, linkInput: DebugElement): void {
    linkInput.triggerEventHandler('input', { target: { value: value } });
    fixture.detectChanges();
  }

  function getHelpInlinePopover(): HTMLSelectElement {
    return el.querySelectorAll('sky-help-inline');
  }
  //#endregion

  it('should create the file drop control', () => {
    fixture.detectChanges();

    const dropEl = getDropEl();

    expect(dropEl).toBeTruthy();
    validateDropClasses(false, false, dropEl);

    const inputEl = getInputDebugEl();
    expect(inputEl.references['fileInput']).toBeTruthy();
  });

  it('should render the labelText when provided', () => {
    fixture.detectChanges();
    let labelEl = getLabelEl();
    expect(labelEl).toBeNull();

    const labelText = 'Label text';
    componentInstance.labelText = labelText;
    fixture.detectChanges();

    labelEl = getLabelEl();

    expect(labelEl).not.toBeNull();
    expect(labelEl?.innerText.trim()).toBe(labelText);
  });

  it('should not display labelText if labelHidden is true', () => {
    const labelText = 'Label text';
    componentInstance.labelText = labelText;
    componentInstance.labelHidden = true;
    fixture.detectChanges();

    const labelEl = getLabelEl();

    expect(labelEl).not.toBeNull();
    expect(labelEl).toHaveCssClass('sky-screen-reader-only');
  });

  it('should render the hintText when provided', () => {
    const hintText = 'Hint text';
    componentInstance.hintText = hintText;
    fixture.detectChanges();

    const hintEl = getHintEl();
    const dropEl = getDropDebugEl();

    expect(hintEl).not.toBeNull();
    expect(hintEl?.innerText.trim()).toBe(hintText);
    expect(
      dropEl?.nativeElement.attributes.getNamedItem('aria-describedby').value,
    ).toBe('MOCK_ID_3');
  });

  it('should display built in validation errors automatically when labelText is set', async () => {
    componentInstance.labelText = 'Label';

    componentInstance.minFileSize = 1500;
    componentInstance.maxFileSize = 3073;
    componentInstance.acceptedTypes = 'image/png, image/jpeg';
    fixture.detectChanges();

    await setupErrorFileChangeEvent();

    const minSizeError = fixture.nativeElement.querySelector(
      "sky-form-error[errorName='minFileSize']",
    );
    const maxSizeError = fixture.nativeElement.querySelector(
      "sky-form-error[errorName='maxFileSize']",
    );
    const typeError = fixture.nativeElement.querySelector(
      "sky-form-error[errorName='fileType']",
    );

    expect(minSizeError).toBeVisible();
    expect(minSizeError.textContent).toContain(
      'foo.txt: Upload a file over 1 KB.',
    );
    expect(maxSizeError).toBeVisible();
    expect(maxSizeError.textContent).toContain(
      'bar.jpeg: Upload a file under 3 KB.',
    );

    expect(typeError).toBeVisible();
    expect(typeError.textContent).toContain(
      'Upload one of these file types: PNG, JPEG.',
    );
  });

  it('should display custom validation errors automatically when labelText is set', async () => {
    componentInstance.labelText = 'Label';
    const errorMessage =
      'You may not upload a file that begins with the letter "w."';

    componentInstance.validateFn = function (
      file: SkyFileItem,
    ): string | undefined {
      if (file.file.name.indexOf('w') === 0) {
        return errorMessage;
      }
      return;
    };

    fixture.detectChanges();

    await setupErrorFileChangeEvent();

    const formError = fixture.nativeElement.querySelector('sky-form-error');

    expect(formError).toBeVisible();
    expect(formError.textContent).toContain('woo.txt: ' + errorMessage);
  });

  it('should have the stacked class if stacked is true', () => {
    fixture.componentInstance.stacked = true;
    fixture.detectChanges();

    expect(fixture.nativeElement).toHaveClass('sky-form-field-stacked');
  });

  it('should not have the stacked class if stacked is false', () => {
    expect(fixture.nativeElement).not.toHaveClass('sky-form-field-stacked');
  });

  it('should click the file input on file drop click', () => {
    testClick(true);
  });

  it('should prevent click when noClick is specified', () => {
    componentInstance.noClick = true;
    fixture.detectChanges();
    testClick(false);
  });

  it('should load and emit files on file change event', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(filesChangedActual?.files.length).toBe(2);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');

    expect(filesChangedActual?.files[1].url).toBe('newUrl');
    expect(filesChangedActual?.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[1].file.size).toBe(2000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');
    expect(liveAnnouncerSpy.calls.count()).toBe(2);
  });

  it('should load and emit files on file change event when file reader has an error and aborts', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
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
    await fixture.whenStable();

    jasmine.clock().tick(501);

    fixture.detectChanges();
    await fixture.whenStable();

    fileReaderSpy.abortCallbacks[0]();
    fileReaderSpy.loadCallbacks[1]({
      target: {
        result: 'anotherUrl',
      },
    });
    fileReaderSpy.errorCallbacks[2]();

    fixture.detectChanges();
    await fixture.whenStable();

    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('anotherUrl');
    expect(filesChangedActual?.files[0].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(2000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(filesChangedActual?.rejectedFiles.length).toBe(2);

    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(1000);

    expect(filesChangedActual?.rejectedFiles[1].file.name).toBe('goo.txt');
    expect(filesChangedActual?.rejectedFiles[1].file.size).toBe(3000);

    expect(liveAnnouncerSpy.calls.count()).toBe(1);
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

  it('should allow the user to specify a min file size', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    componentInstance.minFileSize = 1500;
    fixture.detectChanges();

    await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(1);
    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(1000);
    expect(filesChangedActual?.rejectedFiles[0].errorType).toBe('minFileSize');
    expect(filesChangedActual?.rejectedFiles[0].errorParam).toBe('1500');

    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(2000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(1);
  });

  it('should respect a default min file size of 0', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    const spy = await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(0);
    expect(filesChangedActual?.files.length).toBe(2);

    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[1].file.size).toBe(2000);
    expect(filesChangedActual?.files[1].url).toBe('newUrl');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(2);

    liveAnnouncerSpy.calls.reset();

    // The `as` statement is needed as the analyzer does not know about the subscription that sets this back and causes issues with the future check.
    filesChangedActual = undefined as SkyFileDropChange | undefined;
    componentInstance.minFileSize = 1500;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(undefined, spy);
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(1);
    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(1000);
    expect(filesChangedActual?.rejectedFiles[0].errorType).toBe('minFileSize');
    expect(filesChangedActual?.rejectedFiles[0].errorParam).toBe('1500');

    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(2000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(1);

    liveAnnouncerSpy.calls.reset();

    // The `as` statement is needed as the analyzer does not know about the subscription that sets this back and causes issues with the future check.
    filesChangedActual = undefined as SkyFileDropChange | undefined;
    componentInstance.minFileSize = undefined;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(undefined, spy);
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(0);
    expect(filesChangedActual?.files.length).toBe(2);

    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[1].file.size).toBe(2000);
    expect(filesChangedActual?.files[1].url).toBe('newUrl');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(2);
  });

  it('should allow the user to specify a max file size', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    componentInstance.maxFileSize = 1500;
    fixture.detectChanges();

    await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(1);
    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('woo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(2000);
    expect(filesChangedActual?.rejectedFiles[0].errorType).toBe('maxFileSize');
    expect(filesChangedActual?.rejectedFiles[0].errorParam).toBe('1500');

    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(1);
  });

  it('should respect a default max file size of 500000', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    const spy = await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(0);
    expect(filesChangedActual?.files.length).toBe(2);

    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[1].file.size).toBe(2000);
    expect(filesChangedActual?.files[1].url).toBe('newUrl');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(2);

    liveAnnouncerSpy.calls.reset();

    // The `as` statement is needed as the analyzer does not know about the subscription that sets this back and causes issues with the future check.
    filesChangedActual = undefined as SkyFileDropChange | undefined;
    componentInstance.maxFileSize = 1500;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(undefined, spy);
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(1);
    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('woo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(2000);
    expect(filesChangedActual?.rejectedFiles[0].errorType).toBe('maxFileSize');
    expect(filesChangedActual?.rejectedFiles[0].errorParam).toBe('1500');

    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(1);

    liveAnnouncerSpy.calls.reset();

    // The `as` statement is needed as the analyzer does not know about the subscription that sets this back and causes issues with the future check.
    filesChangedActual = undefined as SkyFileDropChange | undefined;
    componentInstance.maxFileSize = undefined;
    fixture.detectChanges();

    await setupStandardFileChangeEvent(undefined, spy);
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(0);
    expect(filesChangedActual?.files.length).toBe(2);

    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[1].file.size).toBe(2000);
    expect(filesChangedActual?.files[1].url).toBe('newUrl');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(2);
  });

  it('should allow the user to specify a validation function', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    const errorMessage =
      'You may not upload a file that begins with the letter "w."';

    componentInstance.validateFn = function (
      file: SkyFileItem,
    ): string | undefined {
      if (file.file.name.indexOf('w') === 0) {
        return errorMessage;
      }
      return;
    };

    fixture.detectChanges();

    await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(1);
    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('woo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(2000);
    expect(filesChangedActual?.rejectedFiles[0].errorType).toBe('validate');
    expect(filesChangedActual?.rejectedFiles[0].errorParam).toBe(errorMessage);

    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(1);
  });

  it('should allow the user to specify accepted types', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    componentInstance.acceptedTypes = 'image/png,audio/x-midi';

    fixture.detectChanges();

    await setupStandardFileChangeEvent();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(1);
    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('woo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(2000);
    expect(filesChangedActual?.rejectedFiles[0].errorType).toBe('fileType');
    expect(filesChangedActual?.rejectedFiles[0].errorParam).toBe('PNG, MIDI');

    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(1);
  });

  it('should reject a file with no type when accepted types are defined', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
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

    await setupStandardFileChangeEvent(files);
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(2);
    expect(filesChangedActual?.rejectedFiles[1].file.name).toBe('woo.txt');
    expect(filesChangedActual?.rejectedFiles[1].file.size).toBe(2000);
    expect(filesChangedActual?.rejectedFiles[1].errorType).toBe('fileType');
    expect(filesChangedActual?.rejectedFiles[1].errorParam).toBe('PNG, TIFF');

    expect(filesChangedActual?.rejectedFiles[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.rejectedFiles[0].file.size).toBe(1000);
    expect(filesChangedActual?.rejectedFiles[0].errorType).toBe('fileType');
    expect(filesChangedActual?.rejectedFiles[0].errorParam).toBe('PNG, TIFF');

    expect(liveAnnouncerSpy.calls.count()).toBe(0);
  });

  it('should allow the user to specify accepted type with wildcards', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
    );

    componentInstance.acceptedTypes = 'application/*,image/*';

    fixture.detectChanges();

    await setupStandardFileChangeEvent();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(0);

    expect(filesChangedActual?.files.length).toBe(2);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(filesChangedActual?.files[1].url).toBe('newUrl');
    expect(filesChangedActual?.files[1].file.name).toBe('woo.txt');
    expect(filesChangedActual?.files[1].file.size).toBe(2000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('woo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(2);
  });

  it('should load files and set classes on drag and drop', async () => {
    let filesChangedActual: SkyFileDropChange | undefined;

    componentInstance.filesChanged.subscribe(
      (filesChanged: SkyFileDropChange) => (filesChangedActual = filesChanged),
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

    triggerDrop(fixture, files, dropDebugEl);

    validateDropClasses(false, false, dropElWrapper);

    fileReaderSpy.loadCallbacks[0]({
      target: {
        result: 'url',
      },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(filesChangedActual?.rejectedFiles.length).toBe(0);
    expect(filesChangedActual?.files.length).toBe(1);
    expect(filesChangedActual?.files[0].url).toBe('url');
    expect(filesChangedActual?.files[0].file.name).toBe('foo.txt');
    expect(filesChangedActual?.files[0].file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('foo.txt added.');

    expect(liveAnnouncerSpy.calls.count()).toBe(1);

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

      triggerDrop(fixture, invalidFiles, dropDebugEl);
      validateDropClasses(false, false, dropElWrapper);
    },
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
    triggerDrop(fixture, files, dropDebugEl);
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
    triggerDrop(fixture, files, dropDebugEl);
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
    triggerDrop(fixture, files, dropDebugEl);
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
    let fileLinkActual: SkyFileLink | undefined;

    componentInstance.linkChanged.subscribe(
      (newLink: SkyFileLink) => (fileLinkActual = newLink),
    );

    componentInstance.allowLinks = true;
    fixture.detectChanges();

    const linkInput = getLinkInput();

    triggerInputChange('link.com', linkInput);

    const linkButton = getLinkButton();
    linkButton.nativeElement.click();
    fixture.detectChanges();

    expect(fileLinkActual?.url).toBe('link.com');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('Link to link.com added.');
  });

  it('should emit link event when link is added on enter press', () => {
    let fileLinkActual: SkyFileLink | undefined;

    componentInstance.linkChanged.subscribe(
      (newLink: SkyFileLink) => (fileLinkActual = newLink),
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

    expect(fileLinkActual?.url).toBe('link.com');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('Link to link.com added.');
  });

  it('should allow custom content inside of the file drop component', () => {
    const contentFixture = TestBed.createComponent(FileDropContentComponent);

    contentFixture.detectChanges();

    expect(
      contentFixture.debugElement.query(By.css('.sky-file-drop-contents')),
    ).toBeFalsy();
    expect(
      contentFixture.debugElement.query(
        By.css('.sky-file-drop-contents-custom .sky-custom-drop'),
      ),
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

    const linkInput = getLinkInput();
    const dropEl = getDropEl();

    expect(
      linkInput.nativeElement.attributes.getNamedItem('aria-label').value,
    ).toBe('Link to a file');
    expect(dropEl?.attributes.getNamedItem('aria-label')?.value).toBe(
      'Drag a file here or click to browse',
    );

    componentInstance.fileUploadAriaLabel = 'Test 12';
    componentInstance.linkUploadAriaLabel = 'Test 34';

    fixture.detectChanges();

    expect(
      linkInput.nativeElement.attributes.getNamedItem('aria-label').value,
    ).toBe('Test 34');
    expect(dropEl?.attributes.getNamedItem('aria-label')?.value).toBe(
      'Test 12',
    );
  });

  it('should set hint text for the link input', () => {
    const linkUploadHintText = 'Hello, world!';

    componentInstance.allowLinks = true;
    componentInstance.linkUploadHintText = linkUploadHintText;
    fixture.detectChanges();

    const linkInput = getLinkInput();

    const ariaDescribedby =
      linkInput.nativeElement.attributes.getNamedItem('aria-describedby').value;

    expect(
      document.getElementById(ariaDescribedby)?.textContent?.trim(),
    ).toEqual(linkUploadHintText);
  });

  it('should not have required class and aria-required attribute and label should not have screen reader text when not required', () => {
    componentInstance.labelText = 'Testing';
    fixture.detectChanges();
    const legendEl = getLabelEl();
    const labelWrapper = legendEl?.querySelector('.sky-file-drop-label-text');

    expect(
      labelWrapper?.classList.contains('sky-control-label-required'),
    ).toBeFalse();
    expect(legendEl?.querySelector('.sky-screen-reader-only')).toBeNull();
  });

  it('should have appropriate classes and label should have screen reader text when file is required', fakeAsync(() => {
    componentInstance.labelText = 'Testing';
    fixture.componentInstance.required = true;
    fixture.detectChanges();
    const legendEl = getLabelEl();
    const labelWrapper = legendEl?.querySelector('.sky-file-drop-label-text');

    expect(
      labelWrapper?.classList.contains('sky-control-label-required'),
    ).toBeTrue();
    expect(
      legendEl?.querySelector('.sky-screen-reader-only')?.textContent,
    ).toBe('Required');
  }));

  it('should pass accessibility', async () => {
    jasmine.clock().uninstall();
    fixture.detectChanges();
    await fixture.whenStable();

    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('should render help inline with popover only if label text is provided', () => {
    fixture.componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    expect(getHelpInlinePopover().length).toBe(0);

    fixture.componentInstance.labelText = 'labelText';
    fixture.detectChanges();

    expect(getHelpInlinePopover().length).toBe(1);
  });

  it('should not render help inline for popover unless popover content is set', () => {
    componentInstance.helpPopoverTitle = 'popover title';
    fixture.componentInstance.labelText = 'labelText';
    fixture.detectChanges();

    expect(getHelpInlinePopover().length).toBe(0);

    fixture.componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    expect(getHelpInlinePopover().length).toBe(1);
  });

  it('should render help inline if help key is provided', () => {
    componentInstance.helpPopoverContent = undefined;
    fixture.detectChanges();

    expect(getHelpInlinePopover().length).toBe(0);

    componentInstance.helpKey = 'helpKey.html';
    fixture.detectChanges();

    expect(getHelpInlinePopover()).toBeTruthy();
  });

  it('should set global help config with help key', async () => {
    const helpController = TestBed.inject(SkyHelpTestingController);
    componentInstance.labelText = 'label';
    componentInstance.helpKey = 'helpKey.html';
    fixture.componentInstance.helpPopoverContent = 'popover content';
    fixture.detectChanges();

    const helpInlineButton = fixture.nativeElement.querySelector(
      '.sky-help-inline',
    ) as HTMLElement | undefined;
    helpInlineButton?.click();

    await fixture.whenStable();
    fixture.detectChanges();

    helpController.expectCurrentHelpKey('helpKey.html');
  });
});

describe('File drop reactive component', () => {
  let fixture: ComponentFixture<ReactiveFileDropTestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyFileDropModule],
      providers: [provideSkyFileReaderTesting()],
    });
    fixture = TestBed.createComponent(ReactiveFileDropTestComponent);
    fixture.detectChanges();
  });

  it('should mark control as touched on file `drop` event', () => {
    expect(fixture.componentInstance.fileDrop.touched).toBeFalse();
    const dropEl = fixture.debugElement.query(By.css('.sky-file-drop'));

    const dropEvent = {
      dataTransfer: {},
      stopPropagation: function (): void {},
      preventDefault: function (): void {},
    };

    dropEl.triggerEventHandler('drop', dropEvent);
    expect(fixture.componentInstance.fileDrop.touched).toBeTrue();
  });

  it('should mark control as touched on file drop clicked', () => {
    expect(fixture.componentInstance.fileDrop.touched).toBeFalse();
    const dropEl = fixture.nativeElement.querySelector('.sky-file-drop');

    dropEl.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.fileDrop.touched).toBeTrue();
  });

  it('should mark control as touched on link added', () => {
    expect(fixture.componentInstance.fileDrop.touched).toBeFalse();
    const linkButton = fixture.debugElement.query(
      By.css('.sky-file-drop-link button'),
    );
    const linkEl = fixture.debugElement.query(
      By.css('.sky-file-drop-link input'),
    );

    linkEl.triggerEventHandler('input', { target: { value: 'link.url' } });
    fixture.detectChanges();

    linkButton.nativeElement.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.fileDrop.touched).toBeTrue();
  });

  it('should mark control as touched on link blur', () => {
    expect(fixture.componentInstance.fileDrop.touched).toBeFalse();
    const linkEl = fixture.nativeElement.querySelector(
      '.sky-file-drop-link input',
    );

    SkyAppTestUtility.fireDomEvent(linkEl, 'blur');
    fixture.detectChanges();

    expect(fixture.componentInstance.fileDrop.touched).toBeTrue();
  });

  it('should set file drop to required using form control', () => {
    fixture.componentInstance.labelText = 'File Drop';
    fixture.componentInstance.fileDrop.addValidators(Validators.required);
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector(
      '.sky-file-drop-label-text',
    );

    expect(label.classList.contains('sky-control-label-required')).toBeTrue();
  });

  it('should show required error', () => {
    fixture.componentInstance.labelText = 'testing';
    fixture.detectChanges();
    const linkInput = fixture.nativeElement.querySelector(
      '.sky-file-drop-link input',
    );
    SkyAppTestUtility.fireDomEvent(linkInput, 'blur');
    fixture.detectChanges();

    const requiredError = fixture.nativeElement.querySelector(
      "sky-form-error[errorName='required']",
    );
    expect(requiredError).toBeVisible();
  });

  it('should set value', async () => {
    const file: SkyFileItem = {
      file: new File([], 'foo.bar', { type: 'image/png' }),
      url: 'foo.bar.bar',
    };

    const link: SkyFileLink = {
      url: 'foo.foo',
    };

    fixture.componentInstance.fileDrop.setValue([file, link]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.fileDrop.value.length).toBe(2);
  });

  it('should not add invalid files', async () => {
    fixture.componentInstance.fileDrop.setValue([
      {
        file: new File([], 'foo.bar', { type: 'image/png' }),
        url: 'foo.bar.bar',
      },
      {
        file: undefined,
        url: 'foo.bar.bar',
      },
      {
        url: 'foo.bar.bar',
      },

      {
        url: undefined,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.fileDrop.value.length).toBe(2);
  });

  it('should handle no valid files uploaded', async () => {
    fixture.componentInstance.fileDrop.setValue('anything');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.fileDrop.value).toBe(null);

    fixture.componentInstance.fileDrop.setValue([
      {
        file: undefined,
        url: 'foo.bar.bar',
      },
      {
        url: undefined,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.fileDrop.value).toBe(null);
  });

  it('should handle rejecting all files', async () => {
    fixture.componentInstance.acceptedTypes = 'image/png';
    fixture.detectChanges();

    fixture.componentInstance.fileDrop.setValue([
      {
        file: new File([], 'foo.foo', { type: 'abcd/png' }),
        url: 'foo.bar.bar',
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.fileDrop.value).toBe(null);
  });

  it('should handle accepting some files', async () => {
    fixture.componentInstance.acceptedTypes = 'image/png';
    fixture.detectChanges();

    fixture.componentInstance.fileDrop.setValue([
      {
        url: 'foo.bar.bar',
      },
      {
        file: new File([], 'foo.foo', { type: 'abcd/png' }),
        url: 'foo.bar.bar',
      },
    ]);

    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.fileDrop.value.length).toBe(1);
  });

  it('should not set the form control value before handle files is complete', async () => {
    fixture.componentInstance.fileDrop.setValue([
      {
        file: new File([], 'foo.bar', { type: 'image/png' }),
        url: 'foo.bar.bar',
      },
      {
        file: undefined,
        url: 'foo.bar.bar',
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.fileDrop.value.length).toBe(1);
  });
});
