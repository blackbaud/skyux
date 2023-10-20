import { Component, ElementRef, inject } from '@angular/core';

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
