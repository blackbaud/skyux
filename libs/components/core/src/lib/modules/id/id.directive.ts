import { Directive, ElementRef, Renderer2 } from '@angular/core';

let idIndex = 0;

function generateId(): string {
  idIndex++;

  // Include timestamp and an incrementing index to guarantee unique IDs both during the application
  // lifecycle as well as across sessions, since browsers will try to apply autocomplete options to
  // elements with the same ID across sessions.
  return `sky-id-gen__${new Date().getTime()}__${idIndex}`;
}

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

  constructor(elRef: ElementRef, renderer: Renderer2) {
    // Generate and apply the ID before the template is rendered
    // to avoid a changed-after-checked error.
    const id = generateId();

    renderer.setAttribute(elRef.nativeElement, 'id', id);

    this.#_id = id;
  }
}
