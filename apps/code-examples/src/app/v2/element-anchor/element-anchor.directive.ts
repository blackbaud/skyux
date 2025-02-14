import { Directive, ElementRef, effect, inject } from '@angular/core';

@Directive({
  selector: '[skyElementAnchor]',
})
export class SkyElementAnchorDirective {
  readonly #elementRef = inject(ElementRef);

  constructor() {
    effect(() => {
      const el = this.#elementRef.nativeElement as HTMLElement;

      if (el.id) {
        console.log('ID:', el.id);
      }
    });
  }
}
