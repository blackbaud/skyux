import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

import { SkyIdService } from './id.service';

/**
 * Sets the element's `id` attribute to a unique ID. To reference this unique ID on other elements,
 * such as in a `label` element's `for` attribute, assign this directive to a template reference
 * variable, then use its `id` property.
 */
@Directive({
  selector: '[skyId]',
  exportAs: 'skyId',
})
export class SkyIdDirective {
  public get id(): string {
    return this.#_id;
  }

  #_id: string;

  constructor() {
    // Generate and apply the ID before the template is rendered
    // to avoid a changed-after-checked error.
    const id = inject(SkyIdService).generateId();

    inject(Renderer2).setAttribute(inject(ElementRef).nativeElement, 'id', id);

    this.#_id = id;
  }
}
