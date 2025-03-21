import { Component } from '@angular/core';

/**
 * Displays page links on the right side of the page, or below the page content
 * on mobile devices.
 */
@Component({
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
