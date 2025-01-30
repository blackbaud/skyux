import { Injectable, inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { SkyAppWindowRef } from '@skyux/core';
import { SkyLibResourcesService } from '@skyux/i18n';

import { Subject, take } from 'rxjs';

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
@Injectable()
export class SkyTextEditorAdapterService {
  readonly #resourceSvc = inject(SkyLibResourcesService);
  #selectionService: SkyTextEditorSelectionService;
  #textEditorService: SkyTextEditorService;
  #windowRef: SkyAppWindowRef;

  constructor(
    selectionService: SkyTextEditorSelectionService,
    textEditorService: SkyTextEditorService,
    windowService: SkyAppWindowRef,
  ) {
    this.#selectionService = selectionService;
    this.#textEditorService = textEditorService;
    this.#windowRef = windowService;
  }

  /**
   * Creates a text editor inside the supplied iframe element.
   */
  public initEditor(
    id: string,
    iframeElement: HTMLIFrameElement,
    styleState: SkyTextEditorStyleState,
    placeholder?: string,
  ): void {
    this.#textEditorService.editor = this.#createObservers(iframeElement);

    const documentEl = this.#getIframeDocumentEl();
    if (!documentEl) {
      return;
    }

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
    documentEl.querySelector('html')?.setAttribute('lang', 'en');
    documentEl.body.setAttribute('contenteditable', 'true');
    documentEl.body.setAttribute('id', id);
    documentEl.body.setAttribute('role', 'main');
    documentEl.body.setAttribute('class', 'editor');
    documentEl.body.setAttribute('style', bodyStyle);
    documentEl.body.setAttribute('data-placeholder', placeholder || '');
  }

  public disableEditor(
    focusableChildren: HTMLElement[],
    textEditorNativeElement: HTMLElement,
  ): void {
    this.#setEditorDisabled(focusableChildren, textEditorNativeElement, true);
  }

  public enableEditor(
    focusableChildren: HTMLElement[],
    textEditorNativeElement: HTMLElement,
  ): void {
    this.#setEditorDisabled(focusableChildren, textEditorNativeElement, false);
  }

  /**
   * Executes a command on the text editor with the corresponding id.
   */
  public async execCommand(editorCommand: EditorCommand): Promise<void> {
    /* istanbul ignore else */
    if (this.#textEditorService.editor) {
      const documentEl = this.#getIframeDocumentEl();

      if (editorCommand.command === 'paste') {
        // Firefox does not support the clipboard API's `readText` as of 3/24. We are ok with just firing an alert when the paste button is used in Firefox.
        if (!navigator.clipboard.readText) {
          this.#resourceSvc
            .getString('skyux_text_editor_paste_incompatibility_error')
            .pipe(take(1))
            .subscribe((errorString) => alert(errorString));
        } else {
          await navigator.clipboard.readText().then((clipText) => {
            /* istanbul ignore else */
            if (this.editorSelected()) {
              documentEl?.execCommand('insertHTML', false, clipText);

              this.focusEditor();
              this.#textEditorService.editor.commandChangeObservable.next();
            }
          });
        }
      } else {
        /* istanbul ignore else */
        if (this.editorSelected()) {
          documentEl?.execCommand(
            editorCommand.command,
            false,
            editorCommand.value,
          );

          this.focusEditor();
          this.#textEditorService.editor.commandChangeObservable.next();
        }
      }
    }
  }

  public getCurrentSelection(): Selection | null {
    const documentEl = this.#getIframeDocumentEl();
    if (documentEl) {
      return this.#selectionService.getCurrentSelection(documentEl);
    }
    return null;
  }

  /**
   * Returns a data URI using the provided text string.
   * Used to display a merge field inside a string of text.
   */
  public getMergeFieldDataURI(text: string): string {
    const documentEl = this.#windowRef.nativeWindow.document;
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

  public getStyleState(): Partial<SkyTextEditorStyleState> {
    const documentEl = this.#getIframeDocumentEl();

    /* istanbul ignore else */
    if (documentEl && this.editorSelected()) {
      return {
        backColor: this.#getColor(documentEl, 'BackColor'),
        fontColor: this.#getColor(documentEl, 'ForeColor'),
        fontSize: parseInt(this.#getFontSize(), undefined),
        font: documentEl.queryCommandValue('fontname'),
        boldState: documentEl.queryCommandState('Bold'),
        italicState: documentEl.queryCommandState('Italic'),
        underlineState: documentEl.queryCommandState('Underline'),
        linkState: this.#hasLink(),
      };
    }

    /* istanbul ignore next */
    return {};
  }

  public getEditorInnerHtml(): string {
    const documentEl = this.#getIframeDocumentEl();
    if (documentEl) {
      return this.#replaceHtmlCodes(documentEl.body.innerHTML);
    }
    return '';
  }

  public setEditorInnerHtml(value: string): void {
    const documentEl = this.#getIframeDocumentEl();
    const editorContent = documentEl?.body;
    /* istanbul ignore else */
    if (editorContent && editorContent.innerHTML !== value) {
      editorContent.innerHTML = value;
    }
  }

  public focusEditor(): void {
    /* istanbul ignore else */
    if (this.#textEditorService.editor) {
      const windowEl = this.#getContentWindowEl();
      const iframeDocumentEl = this.#getIframeDocumentEl();
      if (windowEl && iframeDocumentEl) {
        const currentSelection =
          this.#selectionService.getCurrentSelectionRange(
            iframeDocumentEl,
            windowEl,
          );
        const cursorIsNotActiveAndHasReset =
          currentSelection &&
          currentSelection.startOffset === 0 &&
          currentSelection.endOffset === 0;

        if (!this.editorSelected() || cursorIsNotActiveAndHasReset) {
          // focus the end of the editor
          const documentEl = this.#windowRef.nativeWindow.document;
          const editor = iframeDocumentEl.body as HTMLBodyElement;
          const range = documentEl.createRange();

          this.#textEditorService.editor.iframeElementRef.focus();
          editor.focus();

          if (windowEl.getSelection && documentEl.createRange) {
            range.selectNodeContents(editor);
            range.collapse(false);
            const sel = windowEl.getSelection();
            sel?.removeAllRanges();
            sel?.addRange(range);
          }
        } else {
          // Cursor may not be active, restore it
          this.#textEditorService.editor.iframeElementRef.focus();
          iframeDocumentEl.body.focus();
        }
      }
    }
  }

  public getLink(): UrlModalResult | undefined {
    let link: UrlModalResult | undefined;
    const anchorEl = this.getSelectedAnchorTag();
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

  public getSelectedAnchorTag(): HTMLAnchorElement | null | undefined {
    const selectedEl = this.#getCurrentSelectionParentElement();

    if (selectedEl) {
      return this.#getParent(selectedEl, 'a') as HTMLAnchorElement;
    }

    return undefined;
  }

  public saveSelection(): Range | undefined {
    const documentEl = this.#getIframeDocumentEl();
    const windowEl = this.#getContentWindowEl();
    if (documentEl && windowEl) {
      return this.#selectionService.getCurrentSelectionRange(
        documentEl,
        windowEl,
      );
    }
    return undefined;
  }

  public selectElement(element: HTMLElement): void {
    const documentEl = this.#getIframeDocumentEl();
    const windowEl = this.#getContentWindowEl();
    if (documentEl && windowEl) {
      this.#selectionService.selectElement(documentEl, windowEl, element);
    }
  }

  public setErrorAttributes(
    errorId: string,
    errors: ValidationErrors | null,
  ): void {
    const documentEl = this.#getIframeDocumentEl();
    documentEl?.body.setAttribute('aria-invalid', (!!errors).toString());
    if (errors && errorId) {
      documentEl?.body.setAttribute('aria-errormessage', errorId);
    } else {
      documentEl?.body.removeAttribute('aria-errormessage');
    }
  }

  public setLabelAttribute(label: string | undefined): void {
    if (label) {
      const documentEl = this.#getIframeDocumentEl();
      documentEl?.body.setAttribute('aria-label', label);
    }
  }

  public setPlaceholder(placeholder?: string): void {
    const documentEl = this.#getIframeDocumentEl();
    documentEl?.body.setAttribute('data-placeholder', placeholder || '');
  }

  public setRequiredAttribute(required: boolean): void {
    const documentEl = this.#getIframeDocumentEl();
    documentEl?.body.setAttribute('aria-required', required.toString());
  }

  public async setFontSize(fontSize: number): Promise<void> {
    const doc = this.#getIframeDocumentEl();
    await this.execCommand({ command: 'fontSize', value: '1' });
    if (doc) {
      const fontElements: HTMLElement[] = Array.from(
        doc.querySelectorAll('font[size="1"]'),
      );
      for (const element of fontElements) {
        element.removeAttribute('size');
        element.style.fontSize = fontSize + 'px';
      }
      this.#cleanUpBlankStyleTags(doc);
    }

    this.focusEditor();
    this.#textEditorService.editor.commandChangeObservable.next();
  }

  public removeObservers(setting: EditorSetting): void {
    /* istanbul ignore next */
    const documentEl = setting.iframeElementRef.contentWindow
      ? setting.iframeElementRef.contentWindow.document
      : setting.iframeElementRef.contentDocument;
    setting.selectionChangeObservable.complete();
    setting.clickObservable.complete();
    setting.commandChangeObservable.complete();
    if (documentEl) {
      documentEl.removeEventListener(
        'selectionchange',
        setting.selectionListener,
      );
      documentEl.removeEventListener('input', setting.selectionListener);
      documentEl.removeEventListener('mousedown', setting.clickListener);
      documentEl.body.removeEventListener('paste', setting.pasteListener);
    }
  }

  #getContentWindowEl(): Window | undefined {
    return this.#textEditorService.editor.iframeElementRef
      .contentWindow as Window;
  }

  #getChildSelectedAnchorTags(): Element[] {
    const selectedRange = this.getCurrentSelection()?.getRangeAt(0);
    if (selectedRange && selectedRange.toString().length <= 0) {
      return [];
    }

    const parentElement = this.#getCurrentSelectionParentElement();

    let childElements: HTMLAnchorElement[] = [];
    /* istanbul ignore else */
    if (parentElement) {
      childElements = Array.from(parentElement.querySelectorAll('a'));
    }

    /* istanbul ignore next */
    return childElements.filter((element) => {
      // IE specific
      if (selectedRange) {
        if (!selectedRange.intersectsNode) {
          if (!element || !element.href) {
            return false;
          }
          const tempRange = document.createRange();
          tempRange.selectNodeContents(element);
          return (
            (selectedRange.compareBoundaryPoints(
              Range.START_TO_START,
              tempRange,
            ) !== -1 &&
              selectedRange.compareBoundaryPoints(
                Range.START_TO_END,
                tempRange,
              ) !== 1) ||
            (selectedRange.compareBoundaryPoints(
              Range.END_TO_START,
              tempRange,
            ) !== -1 &&
              selectedRange.compareBoundaryPoints(
                Range.END_TO_END,
                tempRange,
              ) !== 1)
          );
        }
      }

      // Normal non-IE
      return (
        !!element && !!element.href && selectedRange?.intersectsNode(element)
      );
    });
  }

  #getIframeDocumentEl(): Document | undefined {
    const contentWindowEl = this.#getContentWindowEl();
    /* istanbul ignore else */
    if (contentWindowEl) {
      return contentWindowEl.document;
    }

    /* istanbul ignore next */
    return this.#textEditorService.editor.iframeElementRef
      .contentDocument as Document;
  }

  #getFontSize(): string {
    let fontSize = STYLE_STATE_DEFAULTS.fontSize.toString();
    const selection = this.getCurrentSelection();
    /* istanbul ignore else */
    if (
      selection &&
      selection.anchorNode &&
      selection.anchorNode.parentElement
    ) {
      let element = selection.anchorNode as HTMLElement | null | undefined;
      if (element?.nodeType !== 1) {
        element = element?.parentElement;
      }
      const computedStyle = window.getComputedStyle(element as Element);
      /* istanbul ignore else */
      if (computedStyle) {
        fontSize = computedStyle.getPropertyValue('font-size');
      }
    }
    return fontSize;
  }

  #createObservers(element: HTMLIFrameElement): EditorSetting {
    /* istanbul ignore next */
    const documentEl = element.contentWindow
      ? element.contentWindow.document
      : element.contentDocument;

    // Firefox bug where we need to open/close to cancel load so it doesn't overwrite attrs
    documentEl?.open();
    documentEl?.close();

    const selectionObservable = new Subject<void>();
    const selectionListener = (): void => selectionObservable.next();
    const clickObservable = new Subject<void>();
    const clickListener = (): void => clickObservable.next();
    const pasteListener = this.#getPasteOverride();
    const blurObservable = new Subject<void>();
    const blurListener = (): void => blurObservable.next();
    const focusObservable = new Subject<void>();
    const focusListener = (): void => focusObservable.next();
    const inputObservable = new Subject<void>();
    const inputListener = (): void => inputObservable.next();

    documentEl?.addEventListener('selectionchange', selectionListener);
    documentEl?.addEventListener('input', inputListener);
    documentEl?.addEventListener('mousedown', clickListener);
    documentEl?.body.addEventListener('paste', pasteListener);
    documentEl?.body.addEventListener('blur', blurListener);
    documentEl?.body.addEventListener('focusin', focusListener);
    return {
      blurObservable,
      clickObservable,
      focusObservable,
      commandChangeObservable: new Subject(),
      iframeElementRef: element,
      inputObservable,
      selectionChangeObservable: selectionObservable,
      blurListener,
      focusListener,
      clickListener,
      inputListener,
      pasteListener,
      selectionListener,
    };
  }

  #getPasteOverride(): (e: ClipboardEvent) => void {
    /* istanbul ignore next */
    return (e: ClipboardEvent): void => {
      e.preventDefault();
      const text = e.clipboardData?.getData('text/plain');

      if (text !== undefined) {
        void this.execCommand({
          command: 'insertHTML',
          value: text.toString(),
        });
      }
    };
  }

  #getCurrentSelectionParentElement(): Element | null | undefined {
    const documentEl = this.#getIframeDocumentEl();
    if (documentEl) {
      return this.#selectionService.getCurrentSelectionParentElement(
        documentEl,
      );
    }
    return undefined;
  }

  #getColor(documentEl: Document, selector: string): string {
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

  #hasLink(): boolean {
    const anchorEl = this.getSelectedAnchorTag();
    const childAnchorEls = this.#getChildSelectedAnchorTags();
    /* istanbul ignore next */
    return childAnchorEls.length > 0 || (!!anchorEl && !!anchorEl.href);
  }

  #getParent(element: Element, tag: string): Element | undefined {
    let currentNode: Element | null = element;
    while (currentNode && currentNode.tagName.toUpperCase() !== 'BODY') {
      if (currentNode.tagName.toUpperCase() === tag.toUpperCase()) {
        return currentNode;
      }
      currentNode = currentNode.parentElement;
    }
    return undefined;
  }

  public editorSelected(): boolean {
    const documentEl = this.#getIframeDocumentEl();
    if (documentEl) {
      return this.#selectionService.isElementSelected(
        documentEl,
        documentEl.body,
      );
    }
    return false;
  }

  #cleanUpBlankStyleTags(doc: Document): void {
    const orphanElements: HTMLElement[] = Array.from(
      doc.querySelectorAll('font,span,*[style=""]'),
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
  #replaceHtmlCodes(str: string): string {
    return str
      .replace(/&nbsp;/, String.fromCharCode(160))
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  }

  #setEditorDisabled(
    focusableChildren: HTMLElement[],
    textEditorNativeElement: HTMLElement,
    disabled: boolean,
  ): void {
    textEditorNativeElement.style.pointerEvents = disabled ? 'none' : 'auto';
    textEditorNativeElement.setAttribute(
      'aria-disabled',
      disabled ? 'true' : 'false',
    );
    /* istanbul ignore else */
    if (focusableChildren.length > 0) {
      focusableChildren.forEach((aFocusableChild) => {
        aFocusableChild.tabIndex = disabled ? -1 : 0;
      });
    }
    this.#getIframeDocumentEl()?.body.setAttribute(
      'contenteditable',
      disabled ? 'false' : 'true',
    );
  }
}
