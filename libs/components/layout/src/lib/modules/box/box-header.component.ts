import { Component } from '@angular/core';

/**
 * Specifies a header for the box.
 */
@Component({
  selector: 'sky-box-header',
  templateUrl: './box-header.component.html',
  styles: [
    `
      ::ng-deep sky-help-inline {
        margin-left: var(--sky-margin-inline-sm);
      }
    `,
  ],
})
export class SkyBoxHeaderComponent {}
