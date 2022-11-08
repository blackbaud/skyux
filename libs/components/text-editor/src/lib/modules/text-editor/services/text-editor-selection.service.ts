import { Injectable } from '@angular/core';

/**
 * @internal
 */
@Injectable()
export class SkyTextEditorSelectionService {
  public isElementSelected(
    documentEl: Document,
    element: HTMLElement
  ): boolean {
    const selectedNode = this.getCurrentSelection(documentEl)?.anchorNode;
    /* istanbul ignore next */
    return !!(
      selectedNode &&
      (element.contains(selectedNode) ||
        (selectedNode.parentNode && element.contains(selectedNode.parentNode)))
    );
  }

  public getCurrentSelection(documentEl: Document): Selection | null {
    return documentEl.getSelection();
  }

  public getCurrentSelectionParentElement(
    documentEl: Document
  ): Element | null | undefined {
    const selection = this.getCurrentSelection(documentEl);
    let selectedEl: Element | null;
    /* istanbul ignore else */
    if (
      selection &&
      selection.getRangeAt &&
      selection.getRangeAt(0).commonAncestorContainer
    ) {
      selectedEl = selection.getRangeAt(0).commonAncestorContainer as Element;
      selectedEl =
        selectedEl.nodeType !== 1 ? selectedEl.parentElement : selectedEl;
    } else {
      return undefined;
    }
    return selectedEl;
  }

  public getCurrentSelectionRange(
    documentEl: Document,
    windowEl: Window
  ): Range | undefined {
    /* istanbul ignore else */
    if (windowEl.getSelection) {
      const sel = windowEl.getSelection();
      /* istanbul ignore else */
      if (sel && sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (documentEl.getSelection()?.getRangeAt) {
      return documentEl.getSelection()?.getRangeAt(0);
    }

    /* istanbul ignore next */
    return undefined;
  }

  public selectElement(
    documentEl: Document,
    windowEl: Window,
    element: HTMLElement
  ): void {
    /* istanbul ignore else */
    if (element) {
      /* istanbul ignore else */
      if (windowEl.getSelection) {
        const sel = windowEl.getSelection();
        sel?.removeAllRanges();
        const range = documentEl.createRange();
        range.selectNodeContents(element);
        sel?.addRange(range);
      } else if (documentEl.getSelection) {
        const sel = documentEl.getSelection();
        sel?.removeAllRanges();
        const range = documentEl.createRange();
        range.selectNodeContents(element);
        sel?.addRange(range);
      }
    }
  }
}
