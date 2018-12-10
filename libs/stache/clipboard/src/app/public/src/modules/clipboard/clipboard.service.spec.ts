import { SkyCopyToClipboardService } from './clipboard.service';
const clipboard = require('clipboard-polyfill/build/clipboard-polyfill.promise');

describe('SkyCopyToClipboardService', () => {
  let clipboardService: SkyCopyToClipboardService;
  let testContent: string = 'Test demo content';
  let testElement = document.createElement('div');
  let mockText: string;
  testElement.innerText = testContent;

  beforeEach(() => {
    clipboardService = new SkyCopyToClipboardService();
    spyOn(clipboard, 'writeText').and.callFake((text: string) => {
      mockText = text;
    });
  });

  it('should exist', () => {
    expect(clipboardService).toBeDefined();
  });

  it('should copy text from a textarea element', () => {
    let textareaElement = document.createElement('textarea');
    textareaElement.value = 'test string value';
    clipboardService.copyContent(textareaElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from an input element', () => {
    let inputElement = document.createElement('input');
    inputElement.value = 'test string value';
    clipboardService.copyContent(inputElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from html elements', () => {
    let htmlElement = document.createElement('div');
    htmlElement.innerText = 'test string value';
    clipboardService.copyContent(htmlElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from nested html elements', () => {
    let htmlElement = document.createElement('div');
    htmlElement.innerHTML = '<p>test string value</p>';
    clipboardService.copyContent(htmlElement);
    expect(mockText).toEqual('test string value');
  });

  it('should copy text from nested html elements in multiple teirs', () => {
    let htmlElement = document.createElement('div');
    htmlElement.innerHTML = `<div>upper test string <p>lower test string</p></div>`;
    clipboardService.copyContent(htmlElement);
    expect(mockText).toEqual(`upper test string lower test string`);
  });
});
