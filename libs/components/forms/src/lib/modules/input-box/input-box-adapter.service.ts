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
    hintTextPosition: 'first' | 'last' = 'last',
  ): void {
    const inputEl = inputRef.nativeElement as HTMLElement;

    const previousValue = inputEl.getAttribute(ARIA_DESCRIBEDBY_ATTR);
    const describedByIds =
      previousValue?.split(' ').map((id) => id.trim()) ?? [];

    const hintTextIdIndex = describedByIds.indexOf(hintTextId);

    if (hintText && hintTextIdIndex < 0) {
      if (hintTextPosition === 'last') {
        describedByIds.push(hintTextId);
      } else {
        describedByIds.unshift(hintTextId);
      }
    } else if (!hintText && hintTextIdIndex >= 0) {
      describedByIds.splice(hintTextIdIndex, 1);
    }

    const newValue = describedByIds.join(' ');
    if (newValue !== previousValue) {
      this.#setDescribedByIds(inputEl, newValue);
    }
  }

  #setDescribedByIds(inputEl: HTMLElement, describedByIds: string): void {
    if (describedByIds.length === 0) {
      this.#renderer.removeAttribute(inputEl, ARIA_DESCRIBEDBY_ATTR);
    } else {
      this.#renderer.setAttribute(
        inputEl,
        ARIA_DESCRIBEDBY_ATTR,
        describedByIds,
      );
    }
  }
}
