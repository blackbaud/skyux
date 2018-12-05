import { SkyCopyToClipboardService } from './clipboard.service';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyClipboardWindowRef } from '../shared';

class MockRenderer {
  public selectRootElement(element: any) {
    return {
      select: () => { },
      setSelectionRange: (start: any, end: any) => { }
    };
  }

  public appendChild(parentElement: any, childElement: any) { }
}

class MockRendererFactory {
  public createRenderer(a: any, b: any) {
    return new MockRenderer() as Renderer2;
  }
}

class MockWindowRef {
  public nativeWindow = {
    pageYOffset: 10,
    getSelection() {
      return {
        removeAllRanges() { }
      };
    },
    document: {
      execCommand(command: string) {
        return true;
      },
      queryCommandSupported(command: string) {
        return true;
      },
      createElement(element: string) {
        return document.createElement(element);
      },
      body: { },
      documentElement: {
        scrollTop: 100
      }
    }
  };
}

describe('SkyCopyToClipboardService', () => {
  let clipboardService: SkyCopyToClipboardService;
  let mockRendererFactory: any;
  let mockWindowRef: any;
  let testContent: string = 'Test demo content';
  let testElement = document.createElement('div');
  testElement.innerText = testContent;

  beforeEach(() => {
    mockRendererFactory = new MockRendererFactory();
    mockWindowRef  = new MockWindowRef();

    TestBed.configureTestingModule({
      providers: [
        { provide: SkyClipboardWindowRef, useValue: mockWindowRef },
        SkyCopyToClipboardService,
        { provide: RendererFactory2, useValue: mockRendererFactory}
      ]
    })
    .compileComponents();

    clipboardService = TestBed.get(SkyCopyToClipboardService);
  });

  it('should exist', () => {
    expect(clipboardService).toBeDefined();
  });

  it('should create a text area if target Element is not a valid input', () => {
    expect(clipboardService['copyTextArea']).toBe(undefined);
    clipboardService.copyContent(testElement);
    expect(clipboardService['copyTextArea']).toBeDefined();
    expect((clipboardService['copyTextArea'] instanceof HTMLTextAreaElement)).toBe(true);
  });

  it('should not create a text area if target Element is an input element', () => {
    let inputElement = document.createElement('input');
    expect(clipboardService['copyTextArea']).toBe(undefined);
    clipboardService.copyContent(inputElement);
    expect(clipboardService['copyTextArea']).not.toBeDefined();
    expect((clipboardService['copyTextArea'] instanceof HTMLTextAreaElement)).toBe(false);
  });

  it('should not create a text area if target Element is a textarea element', () => {
    let textareaElement = document.createElement('textarea');
    expect(clipboardService['copyTextArea']).toBe(undefined);
    clipboardService.copyContent(textareaElement);
    expect(clipboardService['copyTextArea']).not.toBeDefined();
    expect((clipboardService['copyTextArea'] instanceof HTMLTextAreaElement)).toBe(false);
  });

  it('should not create a new text area if one already exists', () => {
    expect(clipboardService['copyTextArea']).toBe(undefined);
    let secondElement = document.createElement('p');
    secondElement.innerText = 'Copy this text';

    clipboardService.copyContent(testElement);
    clipboardService['copyTextArea'].setAttribute('test-attribute', 'true');
    expect(clipboardService['copyTextArea']).toBeDefined();
    expect(clipboardService['copyTextArea'].hasAttribute('test-attribute')).toBe(true);

    clipboardService.copyContent(secondElement);
    expect(clipboardService['copyTextArea']).toBeDefined();
    expect(clipboardService['copyTextArea'].hasAttribute('test-attribute')).toBe(true);
  });

  it('should set the top style for the textArea to the documentElement scrollTop if pageYOffset does not exist', () => {
    mockWindowRef.nativeWindow.pageYOffset = undefined;
    clipboardService.copyContent(testElement);
    expect(clipboardService['copyTextArea'].style.top).toBe('-9999px');
  });

  it('should add the content passed into copyContent to the copyTextArea', () => {
    clipboardService.copyContent(testElement);
    expect(clipboardService['copyTextArea'].value).toEqual(testContent);
  });

  it('should call execute document copy command', () => {
    spyOn(mockWindowRef.nativeWindow.document, 'execCommand').and.callThrough();
    clipboardService.copyContent(testElement);
    expect(mockWindowRef.nativeWindow.document.execCommand).toHaveBeenCalledWith('copy');
  });

  it('should call blur on an inputElement if one is provided', () => {
    const inputElement = document.createElement('textarea');
    spyOn(inputElement, 'blur');
    clipboardService.copyContent(inputElement);
    expect(inputElement.blur).toHaveBeenCalled();
  });

  it('should check that copy command is available', () => {
    expect(clipboardService.verifyCopyCommandBrowserSupport()).toEqual(true);
  });
});
