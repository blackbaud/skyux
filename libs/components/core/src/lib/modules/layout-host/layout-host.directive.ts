import {
  Directive,
  ElementRef,
  RendererFactory2,
  effect,
  inject,
  input,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { SkyLayoutHostService } from './layout-host.service';

const LAYOUT_FOR_CHILD_CLASS_PREFIX = 'sky-layout-host-for-child-';
const LAYOUT_CLASS_PREFIX = 'sky-layout-host-';

/**
 * @internal
 */
@Directive({
  selector: '[skyLayoutHost]',
  standalone: true,
  providers: [SkyLayoutHostService],
})
export class SkyLayoutHostDirective<T = 'none' | 'fit'> {
  readonly #elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly #layoutForChild = toSignal(
    inject(SkyLayoutHostService).hostLayoutForChild,
  );
  readonly #renderer = inject(RendererFactory2).createRenderer(null, null);

  public readonly layout = input<T>();

  constructor() {
    effect(() => {
      const cssClass = [`${LAYOUT_CLASS_PREFIX}${this.layout() ?? 'none'}`];
      const layoutForChild = this.#layoutForChild()?.layout;
      if (layoutForChild) {
        cssClass.push(`${LAYOUT_FOR_CHILD_CLASS_PREFIX}${layoutForChild}`);
      }
      const classList = this.#elementRef.nativeElement.classList.values();
      for (const className of classList) {
        if (
          className.startsWith(LAYOUT_CLASS_PREFIX) &&
          !cssClass.includes(className)
        ) {
          this.#renderer.removeClass(this.#elementRef.nativeElement, className);
        }
      }
      for (const className of cssClass) {
        this.#renderer.addClass(this.#elementRef.nativeElement, className);
      }
    });
  }
}
