import { SkyCopyToClipboardService } from './clipboard.service';
import { Renderer2, RendererFactory2 } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkyClipboardWindowRef } from '../shared';
const mock = require('mock-require');
const clipboardPath = 'clipboard-polyfill/build/clipboard-polyfill.promise';

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
  let mockClipboard: any;
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
    mockClipboard = mock(clipboardPath, {
      copiedText: '',
      writeText(text: string) {
        this.copiedText = text;
      }
    });
  });

  afterEach(() => {
    mock.stopAll();
  });

  it('should exist', () => {
    expect(clipboardService).toBeDefined();
  });

  it('should copy text from a textarea element', () => {
    let textareaElement = document.createElement('textarea');
    textareaElement.value = 'test string value';
    clipboardService.copyContent(textareaElement);
    expect(mockClipboard.copiedText).toBe('test string value');
  });
});
