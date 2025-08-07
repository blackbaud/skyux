import { Component, ViewEncapsulation, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';

import { SKY_BOX_HEADER_ID } from './box-header-id-token';

/**
 * Specifies a header for the box.
 * @deprecated Use `headingText` input on the `sky-box` component instead.
 */
@Component({
  selector: 'sky-box-header',
  templateUrl: './box-header.component.html',
  styleUrls: ['./box-header.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class SkyBoxHeaderComponent {
  protected readonly boxHeaderId = inject(SKY_BOX_HEADER_ID);

  constructor() {
    inject(SkyLogService).deprecated('SkyBoxHeaderComponent', {
      deprecationMajorVersion: 10,
      replacementRecommendation:
        'To add a header to box, use the `headingText` input on the box component instead.',
    });
  }
}
