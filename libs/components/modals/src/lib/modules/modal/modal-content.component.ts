import { Component, ViewEncapsulation } from '@angular/core';
import { SkyContainerBreakpointObserverDirective } from '@skyux/core';

/**
 * Specifies content to display in the modal's body.
 */
@Component({
  hostDirectives: [SkyContainerBreakpointObserverDirective],
  standalone: true,
  selector: 'sky-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyModalContentComponent {}
