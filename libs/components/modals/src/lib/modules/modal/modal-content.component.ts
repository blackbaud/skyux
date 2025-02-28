import { Component, ViewEncapsulation } from '@angular/core';
import { SkyResponsiveHostDirective } from '@skyux/core';

/**
 * Specifies content to display in the modal's body.
 */
@Component({
  hostDirectives: [SkyResponsiveHostDirective],
  standalone: true,
  selector: 'sky-modal-content',
  template: `<ng-content />`,
  styleUrls: ['./modal-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyModalContentComponent {}
