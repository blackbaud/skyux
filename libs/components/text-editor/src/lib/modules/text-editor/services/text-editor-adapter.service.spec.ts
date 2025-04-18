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
