import {
  ElementRef,
  Injectable,
  RendererFactory2,
  inject,
} from '@angular/core';

const ARIA_DESCRIBEDBY_ATTR = 'aria-describedby';

/**
 * @internal
 */
@Injectable()
export class SkyInputBoxAdapterService {
  #renderer = inject(RendererFactory2).createRenderer(undefined, null);

  /**
   * Returns whether the provided input box contains the focus event target.
   */
  // TODO: remove this if no longer needed after a scalable focus monitor service is implemented
  public containsElement(inputRef: ElementRef, el: EventTarget): boolean {
    return inputRef.nativeElement.contains(el);
  }

  public focusControl(elRef: ElementRef): void {
    const control = elRef.nativeElement.querySelector('.sky-form-control');
    /* istanbul ignore else */
    if (control) {
      control.focus();
    }
  }

  /**
   * Returns the inline help element.
   */
  public getInlineHelpElement(elRef: ElementRef): HTMLElement {
    return elRef.nativeElement.querySelector('.sky-control-help');
  }

  /**
   * Returns true if the provided element contains the focused element.
   */
  public isFocusInElement(el: HTMLElement): boolean {
    if (el) {
      return (
        el === document.activeElement || el.contains(document.activeElement)
      );
    }
    return false;
  }

  public updateDescribedBy(
    inputRef: ElementRef,
    hintTextId: string,
    hintText: string | undefined,
  ): void {
    const inputEl = inputRef.nativeElement as HTMLElement;

    const describedByIds =
      inputEl
        .getAttribute(ARIA_DESCRIBEDBY_ATTR)
        ?.split(' ')
        .map((id) => id.trim()) ?? [];

    const hintTextIdIndex = describedByIds.indexOf(hintTextId);
    const previousCount = describedByIds.length;

    if (hintText && hintTextIdIndex < 0) {
      describedByIds.push(hintTextId);
    } else if (!hintText && hintTextIdIndex >= 0) {
      describedByIds.splice(hintTextIdIndex, 1);
    }

    if (describedByIds.length !== previousCount) {
      this.#setDescribedByIds(inputEl, describedByIds);
    }
  }

  /**
   * Queries the provided input box with the query string.
   */
  // TODO: remove this if no longer needed after a scalable focus monitor service is implemented
  public queryElement(inputRef: ElementRef, query: string): HTMLElement {
    return inputRef.nativeElement.querySelector(query);
  }

  #setDescribedByIds(inputEl: HTMLElement, describedByIds: string[]): void {
    if (describedByIds.length === 0) {
      this.#renderer.removeAttribute(inputEl, ARIA_DESCRIBEDBY_ATTR);
    } else {
      this.#renderer.setAttribute(
        inputEl,
        ARIA_DESCRIBEDBY_ATTR,
        describedByIds.join(' '),
      );
    }
  }
}
