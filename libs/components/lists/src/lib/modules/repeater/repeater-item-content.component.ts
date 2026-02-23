import { Component } from '@angular/core';

/**
 * Displays content text when the repeater is expanded.
 */
@Component({
  selector: 'sky-repeater-item-content',
  styles: `
    :host {
      display: block;
      overflow: hidden;
    }
  `,
  templateUrl: './repeater-item-content.component.html',
  standalone: false,
})
export class SkyRepeaterItemContentComponent {}
