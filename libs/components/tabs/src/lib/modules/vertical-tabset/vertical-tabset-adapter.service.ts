import { DOCUMENT } from '@angular/common';
import {
  ElementRef,
  Injectable,
  Renderer2,
  RendererFactory2,
  inject,
} from '@angular/core';
import { SkyMediaBreakpoints } from '@skyux/core';

const VERTICAL_TABSET_BUTTON_SELECTOR = '.sky-vertical-tabset-button';
const VERTICAL_TABSET_BUTTON_DISABLED_SELECTOR = `${VERTICAL_TABSET_BUTTON_SELECTOR}-disabled`;

@Injectable()
export class SkyVerticalTabsetAdapterService {
  #renderer: Renderer2;
  #document = inject(DOCUMENT);

  constructor(rendererFactory: RendererFactory2) {
    this.#renderer = rendererFactory.createRenderer(undefined, null);
  }

  public getWidth(elementRef: ElementRef): number {
    return elementRef.nativeElement.clientWidth;
  }

  public scrollToContentTop(element: ElementRef): void {
    element.nativeElement.scrollTop = 0;
  }

  public setResponsiveClass(
    element: ElementRef,
    breakpoint: SkyMediaBreakpoints,
  ): void {
    const nativeEl: HTMLElement = element.nativeElement;

    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-xs');
    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-sm');
    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-md');
    this.#renderer.removeClass(nativeEl, 'sky-responsive-container-lg');

    let newClass: string;

    switch (breakpoint) {
      case SkyMediaBreakpoints.xs: {
        newClass = 'sky-responsive-container-xs';
        break;
      }
      case SkyMediaBreakpoints.sm: {
        newClass = 'sky-responsive-container-sm';
        break;
      }
      case SkyMediaBreakpoints.md: {
        newClass = 'sky-responsive-container-md';
        break;
      }
      default: {
        newClass = 'sky-responsive-container-lg';
        break;
      }
    }

    this.#renderer.addClass(nativeEl, newClass);
  }

  public focusButton(elRef: ElementRef<HTMLElement> | undefined): boolean {
    return this.#focusButtonEl(elRef?.nativeElement);
  }

  public focusFirstButton(
    tabGroups: ElementRef<HTMLElement> | undefined,
  ): void {
    const tabGroupsEl = tabGroups?.nativeElement;

    if (tabGroupsEl) {
      const firstButtonEl = tabGroupsEl.querySelector(
        VERTICAL_TABSET_BUTTON_SELECTOR,
      ) as HTMLElement | null;

      if (firstButtonEl) {
        firstButtonEl.focus();
      }
    }
  }

  public focusNextButton(tabGroups: ElementRef | undefined): void {
    this.#focusSiblingButton(tabGroups);
  }

  public focusPreviousButton(tabGroups: ElementRef | undefined): void {
    this.#focusSiblingButton(tabGroups, true);
  }

  #focusSiblingButton(
    tabGroups: ElementRef<HTMLElement> | undefined,
    previous?: boolean,
  ): void {
    if (tabGroups) {
      const focusedEl = this.#document.activeElement as HTMLElement | null;

      if (focusedEl?.matches(VERTICAL_TABSET_BUTTON_SELECTOR)) {
        const tabGroupsEl = tabGroups.nativeElement;

        const buttonEls = Array.from(
          tabGroupsEl.querySelectorAll(VERTICAL_TABSET_BUTTON_SELECTOR),
        ) as HTMLElement[];

        if (previous) {
          buttonEls.reverse();
        }

        const focusedIndex = buttonEls.indexOf(focusedEl);

        for (let i = 1, n = buttonEls.length; i < n; i++) {
          // Offset the index of the next button from the index of the
          // currently focused button, circling back to the first button
          // when the end of the list is reached.
          const offset = (i + focusedIndex) % n;

          if (this.#focusButtonEl(buttonEls[offset])) {
            break;
          }
        }
      }
    }
  }

  #focusButtonEl(el: HTMLElement | null | undefined): boolean {
    if (el && !el.matches(VERTICAL_TABSET_BUTTON_DISABLED_SELECTOR)) {
      el.focus();
      return this.#elHasFocus(el);
    }

    return false;
  }

  #elHasFocus(el: HTMLElement | null | undefined): boolean {
    return !!el && el === this.#document.activeElement;
  }
}
