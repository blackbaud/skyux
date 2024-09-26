import { Component, inject } from '@angular/core';
import { SkyLayoutHostService } from '@skyux/core';

/**
 * Displays page links within a block page layout.
 * @internal
 */
@Component({
  standalone: true,
  selector: 'sky-page-links',
  template: '<ng-content/>',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SkyPageLinksComponent {
  constructor() {
    inject(SkyLayoutHostService).setHostLayoutForChild({
      layout: 'with-links',
    });
  }
}
