import { SkyCopyToClipboardService } from './clipboard.service';
import { TestBed } from '@angular/core/testing';
const mock = require('mock-require');
const clipboardPath = 'clipboard-polyfill/build/clipboard-polyfill.promise';

describe('SkyCopyToClipboardService', () => {
  let clipboardService: SkyCopyToClipboardService;
  let testContent: string = 'Test demo content';
  let testElement = document.createElement('div');
  let mockClipboard: any;
  testElement.innerText = testContent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []
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
