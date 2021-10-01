import {
  Injectable
} from '@angular/core';

/**
 * @internal
 */
@Injectable({
  providedIn: 'root'
})
export class SkyTextEditorSelectionService {
  public isElementSelected(documentEl: Document, element: HTMLElement) {
    const selectedNode = this.getCurrentSelection(documentEl).anchorNode as HTMLElement;
    return selectedNode &&
      (
        element.contains(selectedNode) || (selectedNode.parentNode && element.contains(selectedNode.parentNode))
      );
  }

  public getCurrentSelection(documentEl: Document): Selection {
    return documentEl.getSelection();
  }

  public getCurrentSelectionParentElement(documentEl: Document): Element {
    const selection = this.getCurrentSelection(documentEl);
    let selectedEl: Element;
    /* istanbul ignore else */
    if (selection &&
        selection.getRangeAt &&
        selection.getRangeAt(0).commonAncestorContainer
    ) {
      selectedEl = selection.getRangeAt(0).commonAncestorContainer as Element;
      selectedEl = selectedEl.nodeType !== 1 ? selectedEl.parentElement : selectedEl;
    } else if (selection && selection.type !== 'Control') {
        selectedEl = (selection as any).createRange().parentElement();
    } else {
      return undefined;
    }
    return selectedEl;
  }

  public getCurrentSelectionRange(documentEl: Document, windowEl: Window): Range {
    /* istanbul ignore else */
    if (windowEl.getSelection) {
      const sel = windowEl.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        return sel.getRangeAt(0);
      }
    } else if (documentEl.getSelection() && documentEl.getSelection().getRangeAt) {
      return documentEl.getSelection().getRangeAt(0);
    }
  }

  public selectElement(documentEl: Document, windowEl: Window, element: HTMLElement): void {
    if (element) {
      /* istanbul ignore else */
      if (windowEl.getSelection) {
        const sel = windowEl.getSelection();
        sel.removeAllRanges();
        const range = documentEl.createRange();
        range.selectNodeContents(element);
        sel.addRange(range);
      } else if (documentEl.getSelection) {
        const sel = documentEl.getSelection();
        sel.removeAllRanges();
        const range = documentEl.createRange();
        range.selectNodeContents(element);
        sel.addRange(range);
      }
    }
  }

}
