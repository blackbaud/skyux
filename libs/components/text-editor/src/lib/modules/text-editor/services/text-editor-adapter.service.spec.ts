import { TestBed } from '@angular/core/testing';

import { STYLE_STATE_DEFAULTS } from '../defaults/style-state-defaults';
import { SkyTextEditorStyleState } from '../types/style-state';

import { SkyTextEditorAdapterService } from './text-editor-adapter.service';
import { SkyTextEditorSelectionService } from './text-editor-selection.service';
import { SkyTextEditorService } from './text-editor.service';

import SpyObj = jasmine.SpyObj;

describe('SkyTextEditorAdapterService', () => {
  let styleState: SkyTextEditorStyleState;
  let doc: SpyObj<Document>;
  let win: SpyObj<Window>;

  beforeEach(() => {
    styleState = Object.assign({}, STYLE_STATE_DEFAULTS);
    doc = jasmine.createSpyObj<Document>(
      'Document',
      [
        'addEventListener',
        'close',
        'createElement',
        'open',
        'removeEventListener',
        'querySelector',
      ],
      {
        body: jasmine.createSpyObj<HTMLBodyElement>([
          'addEventListener',
          'setAttribute',
        ]),
        head: jasmine.createSpyObj<HTMLHeadElement>(['appendChild']),
      },
    );
    doc.createElement.and.callFake((tagName: string) => {
      return document.createElement(tagName);
    });
    win = jasmine.createSpyObj<Window>(
      'Window',
      ['addEventListener', 'removeEventListener'],
      {
        document: doc,
      },
    );
    TestBed.configureTestingModule({
      providers: [
        SkyTextEditorAdapterService,
        SkyTextEditorSelectionService,
        SkyTextEditorService,
      ],
    });
  });

  it('should initialize the editor', () => {
    const service = TestBed.inject(SkyTextEditorAdapterService);
    const iframe = jasmine.createSpyObj<HTMLIFrameElement>(
      'HTMLIFrameElement',
      ['addEventListener', 'removeEventListener'],
      {
        contentWindow: win,
        contentDocument: doc,
      },
    );
    service.initEditor('test', iframe, styleState);
    expect(doc.body.setAttribute).toHaveBeenCalledWith(
      'contenteditable',
      'true',
    );
  });

  it('should initialize the editor using contentDocument', () => {
    const service = TestBed.inject(SkyTextEditorAdapterService);
    const iframe = jasmine.createSpyObj<HTMLIFrameElement>(
      'HTMLIFrameElement',
      ['addEventListener', 'removeEventListener'],
      {
        contentWindow: undefined,
        contentDocument: doc,
      },
    );
    service.initEditor('test', iframe, styleState);
    expect(doc.body.setAttribute).toHaveBeenCalledWith(
      'contenteditable',
      'true',
    );
  });

  it("should copy the host page's font faces into the iframe", () => {
    const hostStyleEl = document.createElement('style');
    hostStyleEl.textContent = `
      @font-face { font-family: 'Test Font'; src: url('test-font.woff'); }
      .test-not-a-font-face { color: red; }
    `;
    document.head.appendChild(hostStyleEl);

    const service = TestBed.inject(SkyTextEditorAdapterService);
    const iframe = jasmine.createSpyObj<HTMLIFrameElement>(
      'HTMLIFrameElement',
      ['addEventListener', 'removeEventListener'],
      {
        contentWindow: win,
        contentDocument: doc,
      },
    );
    service.initEditor('test', iframe, styleState);
    hostStyleEl.remove();

    const iframeStyleEl = (
      doc.head.appendChild as jasmine.Spy
    ).calls.mostRecent().args[0] as HTMLStyleElement;
    expect(iframeStyleEl.innerHTML).toContain('font-family: "Test Font"');
    expect(iframeStyleEl.innerHTML).not.toContain('.test-not-a-font-face');
  });

  describe('font face URLs', () => {
    function getIframeCssForHostStyleSheet(href: string | null): string {
      const hostStyleEl = document.createElement('style');
      hostStyleEl.textContent = `@font-face { font-family: 'Test Font'; src: url('fonts/test-font.woff'); }`;
      document.head.appendChild(hostStyleEl);
      spyOnProperty(document, 'styleSheets').and.returnValue([
        { href, cssRules: hostStyleEl.sheet?.cssRules },
      ] as unknown as StyleSheetList);

      const service = TestBed.inject(SkyTextEditorAdapterService);
      const iframe = jasmine.createSpyObj<HTMLIFrameElement>(
        'HTMLIFrameElement',
        ['addEventListener', 'removeEventListener'],
        {
          contentWindow: win,
          contentDocument: doc,
        },
      );
      service.initEditor('test', iframe, styleState);
      hostStyleEl.remove();

      return (
        (doc.head.appendChild as jasmine.Spy).calls.mostRecent()
          .args[0] as HTMLStyleElement
      ).innerHTML;
    }

    it("should resolve relative URLs against the rule's stylesheet", () => {
      expect(
        getIframeCssForHostStyleSheet('https://cdn.example.com/styles/app.css'),
      ).toContain('url("https://cdn.example.com/styles/fonts/test-font.woff")');
    });

    it("should resolve relative URLs against the host document's base URI when the stylesheet has no URL", () => {
      expect(getIframeCssForHostStyleSheet(null)).toContain(
        `url("${new URL('fonts/test-font.woff', document.baseURI).href}")`,
      );
    });

    it('should preserve URLs that cannot be resolved', () => {
      expect(getIframeCssForHostStyleSheet('not a valid url')).toContain(
        'url("fonts/test-font.woff")',
      );
    });
  });

  it('should skip host stylesheets whose rules cannot be read', () => {
    const crossOriginStyleSheet = {
      get cssRules(): CSSRuleList {
        throw new DOMException('Cannot access rules', 'SecurityError');
      },
    } as unknown as CSSStyleSheet;
    spyOnProperty(document, 'styleSheets').and.returnValue([
      crossOriginStyleSheet,
    ] as unknown as StyleSheetList);

    const service = TestBed.inject(SkyTextEditorAdapterService);
    const iframe = jasmine.createSpyObj<HTMLIFrameElement>(
      'HTMLIFrameElement',
      ['addEventListener', 'removeEventListener'],
      {
        contentWindow: win,
        contentDocument: doc,
      },
    );
    service.initEditor('test', iframe, styleState);

    const iframeStyleEl = (
      doc.head.appendChild as jasmine.Spy
    ).calls.mostRecent().args[0] as HTMLStyleElement;
    expect(iframeStyleEl.innerHTML).not.toContain('@font-face');
    expect(iframeStyleEl.innerHTML).toContain('.editor:empty:before');
  });

  it('should stop initializing the editor when document is null', () => {
    const service = TestBed.inject(SkyTextEditorAdapterService);
    const iframe = jasmine.createSpyObj<HTMLIFrameElement>(
      'HTMLIFrameElement',
      ['addEventListener', 'removeEventListener'],
      {
        contentWindow: undefined,
        contentDocument: undefined,
      },
    );
    service.initEditor('test', iframe, styleState);
    expect(doc.body.setAttribute).not.toHaveBeenCalled();
    expect(service.editorSelected()).toBeFalse();
    expect(service.saveSelection()).toBeUndefined();
    expect(service.getCurrentSelection()).toBeFalsy();
    expect(service.getSelectedAnchorTag()).toBeFalsy();
  });
});
