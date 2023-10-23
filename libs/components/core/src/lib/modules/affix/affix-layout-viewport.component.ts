import { Component, ElementRef, inject } from '@angular/core';

/**
 * Used to measure the layout viewport and any shifts from the visual viewport.
 * https://developer.mozilla.org/en-US/docs/Glossary/Layout_viewport
 * @internal
 */
@Component({
  selector: 'sky-affix-layout-viewport',
  standalone: true,
  template: '',
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        left: 0;
        position: fixed;
        visibility: hidden;
        width: 100%;
        top: 0;
      }
    `,
  ],
})
export class SkyAffixLayoutViewportComponent {
  public readonly element: HTMLElement = inject(ElementRef).nativeElement;
}
