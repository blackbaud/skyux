import { Component } from '@angular/core';

/**
 * Specifies content to display in the tile's body.
 */
@Component({
  selector: 'sky-tile-content',
  styles: `
    :host {
      display: block;
      overflow: hidden;
    }
  `,
  templateUrl: 'tile-content.component.html',
})
export class SkyTileContentComponent {}
