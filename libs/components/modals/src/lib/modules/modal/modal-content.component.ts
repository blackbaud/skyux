import { Component, ViewEncapsulation } from '@angular/core';

/**
 * Specifies content to display in the modal's body.
 */
@Component({
  standalone: true,
  selector: 'sky-modal-content',
  templateUrl: './modal-content.component.html',
  styleUrls: ['./modal-content.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyModalContentComponent {}
