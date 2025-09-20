import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { expect, expectAsync } from '@skyux-sdk/testing';
import { SkyLiveAnnouncerService } from '@skyux/core';

import { SkyFileItem } from '../shared/file-item';

import { SkyFileDropModule } from './file-drop.module';
import { SkyFileItemComponent } from './file-item.component';
import { SkyFileLink } from './file-link';

describe('File item component', () => {
  let fixture: ComponentFixture<SkyFileItemComponent>;
  let componentInstance: SkyFileItemComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SkyFileDropModule],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkyFileItemComponent);
    componentInstance = fixture.componentInstance;
  });

  //#region helper functions
  function getFileItemEl(): DebugElement | null {
    return fixture.debugElement.query(By.css('.sky-file-item'));
  }

  function getNameEl(): DebugElement | null {
    return fixture.debugElement.query(
      By.css('.sky-file-item-title .sky-file-item-name'),
    );
  }

  function getSizeEl(): DebugElement | null {
    return fixture.debugElement.query(
      By.css('.sky-file-item-title .sky-file-item-size'),
    );
  }

  function triggerDelete(): void {
    const deleteEl = fixture.debugElement.query(
      By.css('.sky-file-item-btn-delete'),
    );
    deleteEl.nativeElement.click();
    fixture.detectChanges();
  }

  function getImage(): DebugElement | null {
    return fixture.debugElement.query(
      By.css('.sky-file-item-preview-img-container img'),
    );
  }

  function getOtherPreview(): DebugElement | null {
    return fixture.debugElement.query(
      By.css('.sky-file-item-preview-other sky-icon-svg'),
    );
  }

  function testImage(extension: string): void {
    componentInstance.fileItem = {
      file: {
        name: 'myFile.' + extension,
        type: 'image/' + extension,
        size: 1000,
      },
      url: '$/myFile.' + extension,
    } as SkyFileItem;

    fixture.detectChanges();

    const imageEl = getImage();
    expect(imageEl?.nativeElement.getAttribute('src')).toBe(
      '$/myFile.' + extension,
    );

    const otherEl = getOtherPreview();
    expect(otherEl).toBeFalsy();
  }

  function testOtherPreview(extension: string, type: string): void {
    componentInstance.fileItem = {
      file: {
        name: 'myFile.' + extension,
        type: type + '/' + extension,
        size: 1000,
      },
      url: '$/myFile.' + extension,
    } as SkyFileItem;
    fixture.detectChanges();
    const otherEl = getOtherPreview();
    let expectedClassExtension = type;

    if (
      extension === 'gz' ||
      extension === 'rar' ||
      extension === 'tgz' ||
      extension === 'zip'
    ) {
      expectedClassExtension = 'archive';
    } else if (extension === 'ppt' || extension === 'pptx') {
      expectedClassExtension = 'ppt';
    } else if (extension === 'doc' || extension === 'docx') {
      expectedClassExtension = 'doc';
    } else if (extension === 'xls' || extension === 'xlsx') {
      expectedClassExtension = 'xls';
    } else if (extension === 'txt') {
      expectedClassExtension = 'text';
    } else if (extension === 'htm' || extension === 'html') {
      expectedClassExtension = 'chevron-double';
    }
    expect(otherEl?.nativeElement.getAttribute('data-sky-icon')).toContain(
      'document-' + expectedClassExtension,
    );

    const imageEl = getImage();
    expect(imageEl).toBeFalsy();
  }
  //#endregion

  it('shows the name and size if the item is a file', () => {
    componentInstance.fileItem = {
      file: {
        name: 'myFile.txt',
        size: 1024,
      },
    } as SkyFileItem;
    fixture.detectChanges();

    const nameEl = getNameEl();

    expect(nameEl?.nativeElement.textContent.trim()).toBe('myFile.txt');

    const sizeEl = getSizeEl();
    expect(sizeEl?.nativeElement.textContent).toContain('(1 KB)');
  });

  it('shows the url if the item is a link', async () => {
    componentInstance.fileItem = {
      url: '$/myFile.txt',
    };

    fixture.detectChanges();

    const nameEl = getNameEl();

    expect(nameEl?.nativeElement.textContent.trim()).toBe('$/myFile.txt');

    const sizeEl = getSizeEl();
    expect(sizeEl).toBeFalsy();

    // Test Accessibility
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });

  it('emits the delete event when the delete button is clicked', () => {
    const liveAnnouncerSpy = spyOn(
      TestBed.inject(SkyLiveAnnouncerService),
      'announce',
    );

    componentInstance.fileItem = {
      url: '$/myFile.txt',
    };
    let deletedItem: SkyFileLink | undefined;

    componentInstance.deleteFile.subscribe(
      (newDeletedFile: SkyFileLink) => (deletedItem = newDeletedFile),
    );

    fixture.detectChanges();
    triggerDelete();

    expect(deletedItem?.url).toBe('$/myFile.txt');
    expect(liveAnnouncerSpy).toHaveBeenCalledWith(
      'Link to $/myFile.txt removed.',
    );

    componentInstance.fileItem = {
      file: {
        name: 'myFile.txt',
        size: 1000,
        type: 'file/txt',
      },
    } as SkyFileItem;

    let deletedFile: SkyFileItem | undefined;

    componentInstance.deleteFile.subscribe(
      (newDeletedFile: SkyFileItem) => (deletedFile = newDeletedFile),
    );
    fixture.detectChanges();

    triggerDelete();

    expect(deletedFile?.file.name).toBe('myFile.txt');
    expect(deletedFile?.file.size).toBe(1000);
    expect(liveAnnouncerSpy).toHaveBeenCalledWith('myFile.txt removed.');

    expect(liveAnnouncerSpy.calls.count()).toBe(2);
  });

  it('shows an image if the item is an image', () => {
    testImage('png');
    testImage('bmp');
    testImage('jpeg');
    testImage('gif');
  });

  it('shows a file icon with the proper extension if it is not an image', () => {
    testOtherPreview('pdf', 'pdf');
    testOtherPreview('gz', 'gz');
    testOtherPreview('rar', 'rar');
    testOtherPreview('tgz', 'tgz');
    testOtherPreview('zip', 'zip');
    testOtherPreview('ppt', 'ppt');
    testOtherPreview('pptx', 'pptx');
    testOtherPreview('doc', 'doc');
    testOtherPreview('docx', 'docx');
    testOtherPreview('xls', 'xls');
    testOtherPreview('xlsx', 'xlsx');
    testOtherPreview('txt', 'txt');
    testOtherPreview('htm', 'htm');
    testOtherPreview('html', 'html');
    testOtherPreview('mp3', 'audio');
    testOtherPreview('tiff', 'image');
    testOtherPreview('other', 'text');
    testOtherPreview('mp4', 'video');
  });

  it('should not show anything if a file item is not given', () => {
    componentInstance.fileItem = undefined;
    fixture.detectChanges();

    expect(getFileItemEl()).toBeNull();
    expect(getNameEl()).toBeNull();
    expect(getSizeEl()).toBeNull();
  });

  it('should pass accessibility', async () => {
    componentInstance.fileItem = {
      file: {
        name: 'myFile.txt',
        size: 1000,
      },
    } as SkyFileItem;
    fixture.detectChanges();
    await fixture.whenStable();
    await expectAsync(fixture.nativeElement).toBeAccessible();
  });
});
