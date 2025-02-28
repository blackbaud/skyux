import { Component } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

/**
 * Specifies content to display in the modal's body.
 */
@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  standalone: true,
  selector: 'sky-modal-content',
  template: `<ng-content />`,
})
export class SkyModalContentComponent {}
