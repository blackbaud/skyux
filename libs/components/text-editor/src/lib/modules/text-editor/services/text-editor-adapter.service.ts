import { Injectable } from '@angular/core';
import { SkyAppWindowRef } from '@skyux/core';

import { Subject } from 'rxjs';

import { STYLE_STATE_DEFAULTS } from '../defaults/style-state-defaults';
import { EditorCommand } from '../types/editor-command';
import { EditorSetting } from '../types/editor-setting';
import { SkyTextEditorStyleState } from '../types/style-state';
import { UrlModalResult } from '../url-modal/text-editor-url-modal-result';
import { UrlTarget } from '../url-modal/text-editor-url-target';

import { SkyTextEditorSelectionService } from './text-editor-selection.service';
import { SkyTextEditorService } from './text-editor.service';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root',
})
export class SkyTextEditorAdapterService {
  private get editors(): { [key: string]: EditorSetting } {
    return this.textEditorService.editors;
  }

  constructor(
    private selectionService: SkyTextEditorSelectionService,
    private textEditorService: SkyTextEditorService,
    private windowService: SkyAppWindowRef
  ) {}

  /**
   * Creates a text editor inside the supplied iframe element.
   */
  public addEditor(
    id: string,
    iframeElement: HTMLIFrameElement,
    styleState: SkyTextEditorStyleState,
    placeholder?: string
  ): void {
    /* istanbul ignore else */
    if (!(id in this.editors)) {
      this.editors[id] = this.createObservers(id, iframeElement);

      const documentEl = this.getIframeDocumentEl(id);

      const styleEl = documentEl.createElement('style');
      styleEl.innerHTML = `.editor:empty:before {
        content: attr(data-placeholder);
        font-family: "Blackbaud Sans", Arial, sans-serif;
        color: #686c73;
        font-weight: 400;
        font-size: 15px;
        font-style: italic;
      }`;
      documentEl.head.appendChild(styleEl);

      const style: SkyTextEditorStyleState = {
        ...STYLE_STATE_DEFAULTS,
        ...styleState,
      };
      const bodyStyle = `background-color: ${style.backColor};
        color: ${style.fontColor};
        font-family: ${style.font};
        font-size: ${style.fontSize}px`;
      documentEl.querySelector('html').setAttribute('lang', 'en');
      documentEl.body.setAttribute('contenteditable', 'true');
      documentEl.body.setAttribute('id', id);
      documentEl.body.setAttribute('role', 'main');
      documentEl.body.setAttribute('class', 'editor');
      documentEl.body.setAttribute('style', bodyStyle);
      documentEl.body.setAttribute('data-placeholder', placeholder || '');
    }
  }

  public disableEditor(
    id: string,
    focusableChildren: HTMLElement[],
    textEditorNativeElement: any
  ): void {
    this.setEditorDisabled(
      id,
      focusableChildren,
      textEditorNativeElement,
      true
    );
  }

  public enableEditor(
    id: string,
    focusableChildren: HTMLElement[],
    textEditorNativeElement: any
  ): void {
    this.setEditorDisabled(
      id,
      focusableChildren,
      textEditorNativeElement,
      false
    );
  }

  /**
   * Executes a command on the text editor with the corresponding id.
   */
  public execCommand(id: string, editorCommand: EditorCommand): void {
    /* istanbul ignore else */
    if (id in this.editors) {
      const documentEl = this.getIframeDocumentEl(id);

      /* istanbul ignore else */
      if (this.editorSelected(id)) {
        const commandIsSupportedAndEnabled = documentEl.execCommand(
          editorCommand.command,
          false,
          editorCommand.value
        );

        // IE11 doesn't support insertHTML
        /* istanbul ignore next */
        if (
          editorCommand.command.toLowerCase() === 'inserthtml' &&
          !commandIsSupportedAndEnabled
        ) {
          this.insertHtmlInIE11(id, editorCommand.value);
        }

        this.focusEditor(id);
        this.editors[id].commandChangeObservable.next();
      }
    }
  }

  public getCurrentSelection(id: string): Selection {
    return this.selectionService.getCurrentSelection(
      this.getIframeDocumentEl(id)
    );
  }

  /**
   * Returns a data URI using the provided text string.
   * Used to display a merge field inside a string of text.
   */
  public getMergeFieldDataURI(text: string): string {
    const documentEl = this.windowService.nativeWindow.document;
    let textToUse = text;
    if (text.length > 18) {
      textToUse = text.substr(0, 15) + '...';
    }

    const canvasElement = documentEl.createElement('canvas');
    canvasElement.setAttribute('height', '20');
    canvasElement.setAttribute('width', '100');
    canvasElement.style.backgroundColor = 'tan';
    canvasElement.style.border = '1px solid #000000';
    canvasElement.style.borderRadius = '5px';

    const context = canvasElement.getContext('2d');
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.fillText(textToUse, 50, 15);

    context.globalCompositeOperation = 'destination-over';
    context.fillStyle = '#00FFFF';
    context.fillRect(0, 0, 100, 20);

    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 2;
    context.strokeStyle = '#FF0000';
    context.strokeRect(0, 0, 100, 20);

    const result = canvasElement.toDataURL('image/png', 1.0);
    return result;
  }

  public getStyleState(id: string): Partial<SkyTextEditorStyleState> {
    const documentEl = this.getIframeDocumentEl(id);

    /* istanbul ignore else */
    if (this.editorSelected(id)) {
      return {
        backColor: this.getColor(documentEl, 'BackColor'),
        fontColor: this.getColor(documentEl, 'ForeColor'),
        fontSize: parseInt(this.getFontSize(id), undefined),
        font: documentEl.queryCommandValue('fontname'),
        boldState: documentEl.queryCommandState('Bold'),
        italicState: documentEl.queryCommandState('Italic'),
        underlineState: documentEl.queryCommandState('Underline'),
        linkState: this.hasLink(id),
      };
    }

    /* istanbul ignore next */
    return {};
  }

  public getEditorInnerHtml(id: string): string {
    const documentEl = this.getIframeDocumentEl(id);
    if (documentEl) {
      return this.replaceHtmlCodes(documentEl.body.innerHTML);
    }
    return '';
  }

  public setEditorInnerHtml(id: string, value: string): void {
    const documentEl = this.getIframeDocumentEl(id);
    const editorContent = documentEl.body;
    /* istanbul ignore else */
    if (editorContent.innerHTML !== value) {
      editorContent.innerHTML = value;
    }
  }

  public focusEditor(id: string): void {
    /* istanbul ignore else */
    if (id in this.editors) {
      const windowEl = this.getContentWindowEl(id);
      const iframeDocumentEl = this.getIframeDocumentEl(id);
      const currentSelection = this.selectionService.getCurrentSelectionRange(
        iframeDocumentEl,
        windowEl
      );
      const cursorIsNotActiveAndHasReset =
        currentSelection &&
        currentSelection.startOffset === 0 &&
        currentSelection.endOffset === 0;

      if (!this.editorSelected(id) || cursorIsNotActiveAndHasReset) {
        // focus the end of the editor
        const documentEl = this.windowService.nativeWindow.document;
        const editor: any = iframeDocumentEl.body;
        const range = documentEl.createRange();

        this.editors[id].iframeElementRef.focus();
        editor.focus();
        /* istanbul ignore else */
        if (windowEl.getSelection && documentEl.createRange) {
          range.selectNodeContents(editor);
          range.collapse(false);
          const sel = windowEl.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        } else {
          // IE only
          const textRange = editor.createTextRange();
          textRange.moveToElementText(editor);
          textRange.collapse(false);
          textRange.select();
        }
      } else {
        // Cursor may not be active, restore it
        this.editors[id].iframeElementRef.focus();
        iframeDocumentEl.body.focus();
      }
    }
  }

  public getLink(editorId: string): UrlModalResult {
    let link: UrlModalResult = undefined;
    const anchorEl = this.getSelectedAnchorTag(editorId);
    if (anchorEl && anchorEl.href) {
      link = {
        target:
          anchorEl.getAttribute('target') === '_blank'
            ? UrlTarget.NewWindow
            : UrlTarget.None,
        url: anchorEl.href,
      };
    }

    return link;
  }

  public getSelectedAnchorTag(editorId: string): HTMLAnchorElement {
    const selectedEl = this.getCurrentSelectionParentElement(editorId);

    return this.getParent(selectedEl, 'a') as HTMLAnchorElement;
  }

  public saveSelection(id: string): Range {
    return this.selectionService.getCurrentSelectionRange(
      this.getIframeDocumentEl(id),
      this.getContentWindowEl(id)
    );
  }

  public selectElement(id: string, element: HTMLElement): void {
    this.selectionService.selectElement(
      this.getIframeDocumentEl(id),
      this.getContentWindowEl(id),
      element
    );
  }

  public setPlaceholder(id: string, placeholder?: string): void {
    const documentEl = this.getIframeDocumentEl(id);
    documentEl.body.setAttribute('data-placeholder', placeholder || '');
  }

  public setFontSize(id: string, fontSize: number): void {
    const doc = this.getIframeDocumentEl(id);
    this.execCommand(id, { command: 'fontSize', value: 1 });
    const fontElements: HTMLElement[] = Array.from(
      doc.querySelectorAll('font[size="1"]')
    );
    for (const element of fontElements) {
      element.removeAttribute('size');
      element.style.fontSize = fontSize + 'px';
    }
    this.cleanUpBlankStyleTags(doc);

    this.focusEditor(id);
    this.editors[id].commandChangeObservable.next();
  }

  public removeObservers(setting: EditorSetting): void {
    /* istanbul ignore next */
    const documentEl = setting.iframeElementRef.contentWindow
      ? setting.iframeElementRef.contentWindow.document
      : setting.iframeElementRef.contentDocument;
    setting.selectionChangeObservable.complete();
    setting.clickObservable.complete();
    setting.commandChangeObservable.complete();
    documentEl.removeEventListener(
      'selectionchange',
      setting.selectionListener
    );
    documentEl.removeEventListener('input', setting.selectionListener);
    documentEl.removeEventListener('mousedown', setting.clickListener);
    documentEl.body.removeEventListener('paste', setting.pasteListener);
  }

  private getContentWindowEl(id: string): Window {
    return this.editors[id].iframeElementRef.contentWindow;
  }

  private getChildSelectedAnchorTags(editorId: string): Element[] {
    const selectedRange = this.getCurrentSelection(editorId).getRangeAt(0);
    if (selectedRange.toString().length <= 0) {
      return [];
    }

    const parentElement = this.getCurrentSelectionParentElement(editorId);

    let childElements = [];
    /* istanbul ignore else */
    if (parentElement) {
      childElements = Array.from(parentElement.querySelectorAll('a'));
    }

    /* istanbul ignore next */
    return childElements.filter((element) => {
      // IE specific
      if (!selectedRange.intersectsNode) {
        if (!element || !element.href) {
          return false;
        }
        const tempRange = document.createRange();
        tempRange.selectNodeContents(element);
        return (
          (selectedRange.compareBoundaryPoints(
            Range.START_TO_START,
            tempRange
          ) !== -1 &&
            selectedRange.compareBoundaryPoints(
              Range.START_TO_END,
              tempRange
            ) !== 1) ||
          (selectedRange.compareBoundaryPoints(
            Range.END_TO_START,
            tempRange
          ) !== -1 &&
            selectedRange.compareBoundaryPoints(Range.END_TO_END, tempRange) !==
              1)
        );
      }

      // Normal non-IE
      return (
        !!element && !!element.href && selectedRange.intersectsNode(element)
      );
    });
  }

  private getIframeDocumentEl(id: string): Document {
    /* istanbul ignore next */
    if (!(id in this.editors)) {
      return undefined;
    }

    const contentWindowEl = this.getContentWindowEl(id);
    /* istanbul ignore else */
    if (contentWindowEl) {
      return contentWindowEl.document;
    }

    /* istanbul ignore next */
    return this.editors[id].iframeElementRef.contentDocument;
  }

  private getFontSize(id: string): string {
    let fontSize = STYLE_STATE_DEFAULTS.fontSize.toString();
    const selection = this.getCurrentSelection(id);
    /* istanbul ignore else */
    if (
      selection &&
      selection.anchorNode &&
      selection.anchorNode.parentElement
    ) {
      let element = selection.anchorNode;
      if (element.nodeType !== 1) {
        element = element.parentElement;
      }
      const computedStyle = window.getComputedStyle(element as Element);
      /* istanbul ignore else */
      if (computedStyle) {
        fontSize = computedStyle.getPropertyValue('font-size');
      }
    }
    return fontSize;
  }

  private createObservers(
    id: string,
    element: HTMLIFrameElement
  ): EditorSetting {
    /* istanbul ignore next */
    const documentEl = element.contentWindow
      ? element.contentWindow.document
      : element.contentDocument;

    // Firefox bug where we need to open/close to cancel load so it doesn't overwrite attrs
    documentEl.open();
    documentEl.close();

    const selectionObservable = new Subject<void>();
    const selectionListener = () => selectionObservable.next();
    const clickObservable = new Subject<void>();
    const clickListener = () => clickObservable.next();
    const pasteListener = this.getPasteOverride(id);
    const blurObservable = new Subject<void>();
    const blurListener = () => blurObservable.next();
    const inputObservable = new Subject<void>();
    const inputListener = () => inputObservable.next();

    documentEl.addEventListener('selectionchange', selectionListener);
    documentEl.addEventListener('input', inputListener);
    documentEl.addEventListener('mousedown', clickListener);
    documentEl.body.addEventListener('paste', pasteListener);
    documentEl.body.addEventListener('blur', blurListener);
    return {
      blurObservable: blurObservable,
      clickObservable: clickObservable,
      commandChangeObservable: new Subject(),
      iframeElementRef: element,
      inputObservable: inputObservable,
      selectionChangeObservable: selectionObservable,
      blurListener: blurListener,
      clickListener: clickListener,
      inputListener: inputListener,
      pasteListener: pasteListener,
      selectionListener: selectionListener,
    };
  }

  /* istanbul ignore next */
  private getPasteOverride(id: string): (e: ClipboardEvent) => void {
    return (e: ClipboardEvent): void => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      this.execCommand(id, { command: 'insertHTML', value: text });
    };
  }

  private getCurrentSelectionParentElement(id: string): Element {
    return this.selectionService.getCurrentSelectionParentElement(
      this.getIframeDocumentEl(id)
    );
  }

  private getColor(documentEl: Document, selector: string): string {
    const commandValue = documentEl.queryCommandValue(selector);

    // Edge is weird and returns numbers
    /* istanbul ignore if */
    if (typeof commandValue === 'number') {
      /* istanbul ignore next */
      return (
        'rgb(' +
        (commandValue & 0xff) +
        ', ' +
        ((commandValue & 0xff00) >> 8) +
        ', ' +
        ((commandValue & 0xff0000) >> 16) +
        ')'
      );
    }

    // Firefox uses 'Transparent' instead of a color value
    /* istanbul ignore next */
    if (commandValue.toString().toLowerCase() === 'transparent') {
      return STYLE_STATE_DEFAULTS.backColor;
    }
    return commandValue;
  }

  private hasLink(editorId: string): boolean {
    const anchorEl = this.getSelectedAnchorTag(editorId);
    const childAnchorEls = this.getChildSelectedAnchorTags(editorId);
    /* istanbul ignore next */
    return childAnchorEls.length > 0 || (!!anchorEl && !!anchorEl.href);
  }

  private getParent(element: Element, tag: string): Element {
    let currentNode = element;
    while (currentNode && currentNode.tagName.toUpperCase() !== 'BODY') {
      if (currentNode.tagName.toUpperCase() === tag.toUpperCase()) {
        return currentNode;
      }
      currentNode = currentNode.parentElement;
    }
    return undefined;
  }

  private editorSelected(id: string): boolean {
    const documentEl = this.getIframeDocumentEl(id);
    return this.selectionService.isElementSelected(documentEl, documentEl.body);
  }

  /* istanbul ignore next */
  private insertHtmlInIE11(id: string, html: string): void {
    const documentEl = this.getIframeDocumentEl(id);
    const windowEl = this.getContentWindowEl(id);
    const sel = windowEl.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      let range = sel.getRangeAt(0);
      range.deleteContents();

      const el = documentEl.createElement('div');
      el.innerHTML = html;
      const frag = documentEl.createDocumentFragment();
      let node, lastNode;
      while (el.firstChild) {
        node = el.firstChild;
        lastNode = frag.appendChild(node);
      }
      range.insertNode(frag);

      // Preserve the selection
      if (lastNode) {
        range = range.cloneRange();
        range.setStartAfter(lastNode);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    }
  }

  private cleanUpBlankStyleTags(doc: Document): void {
    const orphanElements: HTMLElement[] = Array.from(
      doc.querySelectorAll('font,span,*[style=""]')
    );
    for (const element of orphanElements) {
      if (!element.getAttribute('style')) {
        element.removeAttribute('style');
      }
    }
    const removableElements = orphanElements.filter((element) => {
      const tagName = element.tagName.toUpperCase();
      return (
        (tagName === 'FONT' || tagName === 'SPAN') &&
        (element.attributes.length === 0 || !element.hasChildNodes)
      );
    });
    for (const element of removableElements) {
      const parent = element.parentNode;
      /* istanbul ignore else */
      if (parent) {
        while (element.firstChild) {
          parent.insertBefore(element.firstChild, element);
        }
        parent.removeChild(element);
      }
    }
  }

  // Certain values are encoded in html and need to be decoded
  private replaceHtmlCodes(str: string): string {
    return str
      .replace(/&nbsp;/, String.fromCharCode(160))
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }

  private setEditorDisabled(
    id: string,
    focusableChildren: HTMLElement[],
    textEditorNativeElement: any,
    disabled: boolean
  ): void {
    textEditorNativeElement.style.pointerEvents = disabled ? 'none' : 'auto';
    textEditorNativeElement.setAttribute(
      'aria-disabled',
      disabled ? 'true' : 'false'
    );
    /* istanbul ignore else */
    if (focusableChildren.length > 0) {
      focusableChildren.forEach((aFocusableChild) => {
        aFocusableChild.tabIndex = disabled ? -1 : 0;
      });
    }
    this.getIframeDocumentEl(id).body.setAttribute(
      'contenteditable',
      disabled ? 'false' : 'true'
    );
  }
}
