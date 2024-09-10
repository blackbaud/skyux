import {
  ElementRef,
  Injectable,
  OnDestroy,
  Renderer2,
  inject,
} from '@angular/core';
import { SkyIdService } from '@skyux/core';

/**
 * Inserts an empty "pointer" element after the host element to direct screen
 * readers to the opened popover content. Popover content is appended to the
 * document body, but it needs to be associated with the host element to meet
 * accessibility requirements. This is done by setting `aria-owns` on the
 * pointer element, which instructs the screen reader to consider the popover
 * contents as a child of the pointer element. We cannot set `aria-owns` on
 * the host element because it is nearly always a button, and buttons cannot
 * have block-level children.
 * @see https://github.com/w3c/html-aria/issues/124
 * @internal
 */
@Injectable()
export class SkyPopoverSRPointerService implements OnDestroy {
  #srPointerEl: HTMLSpanElement | undefined;

  readonly #renderer = inject(Renderer2);
  readonly #srPointerId = inject(SkyIdService).generateId();
  readonly #hostEl = inject(ElementRef<HTMLElement>);

  public ngOnDestroy(): void {
    this.destroySRPointerEl();
  }

  public createSRPointerEl(): void {
    const pointerEl = this.#renderer.createElement('span');
    this.#renderer.setAttribute(pointerEl, 'id', this.#srPointerId);
    this.#srPointerEl = pointerEl;

    const hostEl = this.#hostEl?.nativeElement;
    this.#renderer.setAttribute(hostEl, 'aria-controls', this.#srPointerId);
    hostEl?.parentNode?.insertBefore(pointerEl, hostEl.nextSibling);
  }

  public destroySRPointerEl(): void {
    this.#srPointerEl?.remove();
    this.#srPointerEl = undefined;
  }

  public updateAriaAttributes(options: {
    ariaExpanded: boolean;
    ariaOwns?: string;
  }): void {
    const hostEl = this.#hostEl?.nativeElement;
    const pointerEl = this.#srPointerEl;

    // Only set attributes if the pointer element exists.
    if (pointerEl) {
      this.#renderer.setAttribute(
        hostEl,
        'aria-expanded',
        options.ariaExpanded ? 'true' : 'false',
      );

      if (options.ariaExpanded === true) {
        if (options.ariaOwns) {
          this.#renderer.setAttribute(pointerEl, 'aria-owns', options.ariaOwns);
        }
      } else {
        this.#renderer.removeAttribute(pointerEl, 'aria-owns');
      }
    } else {
      this.#renderer.removeAttribute(hostEl, 'aria-expanded');
    }
  }
}
