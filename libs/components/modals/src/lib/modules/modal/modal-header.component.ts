import { Component, inject } from '@angular/core';
import { SkyLogService } from '@skyux/core';
import { SkyTrimModule } from '@skyux/core';
import { SkyThemeModule } from '@skyux/theme';

/**
 * Specifies a header for the modal.
 * @deprecated Use the `headingText` input on the modal component instead. This component will be removed in the next major version release.
 */
@Component({
  selector: 'sky-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss'],
  imports: [SkyThemeModule, SkyTrimModule],
})
export class SkyModalHeaderComponent {
  readonly #logService = inject(SkyLogService);

  constructor() {
    this.#logService.deprecated('SkyModalHeaderComponent', {
      deprecationMajorVersion: 14,
      replacementRecommendation:
        'Use the `headingText` input on the modal component instead.',
    });
  }
}
