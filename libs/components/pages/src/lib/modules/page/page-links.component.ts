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
      display: var(--sky-layout-host-links-display, block);
      margin: var(--sky-layout-host-links-spacing, 0);
    }
  `,
})
export class SkyPageLinksComponent {}
