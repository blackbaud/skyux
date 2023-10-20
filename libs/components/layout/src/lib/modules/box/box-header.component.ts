import { Component, ViewEncapsulation, inject } from '@angular/core';

import { SKY_BOX_HEADER_ID } from './box-header-id-token';

/**
 * Specifies a header for the box.
 */
@Component({
  selector: 'sky-box-header',
  templateUrl: './box-header.component.html',
  styleUrls: ['./box-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SkyBoxHeaderComponent {
  protected readonly boxHeaderId = inject(SKY_BOX_HEADER_ID);
}
