import { Component } from '@angular/core';

/**
 * Displays page links within a block page layout.
 * @internal
 */
@Component({
  standalone: true,
  selector: 'sky-page-links',
  template: '<ng-content />',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class SkyPageLinksComponent {}
