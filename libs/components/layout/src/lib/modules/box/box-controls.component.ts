import { Component, inject } from '@angular/core';
import { SkyContentInfoProvider } from '@skyux/core';

import { SKY_BOX_HEADER_ID } from './box-header-id-token';

/**
 * Specifies the controls to display in upper right corner of the box. These buttons typically let users edit the box content.
 */
@Component({
  selector: 'sky-box-controls',
  templateUrl: './box-controls.component.html',
  providers: [SkyContentInfoProvider],
  standalone: false,
})
export class SkyBoxControlsComponent {
  public boxHasHeader(value: boolean): void {
    if (value) {
      this.#contentInfoProvider.patchInfo({
        descriptor: { type: 'elementId', value: this.#boxHeaderId },
      });
    } else {
      this.#contentInfoProvider.patchInfo({ descriptor: undefined });
    }
  }

  readonly #contentInfoProvider = inject(SkyContentInfoProvider);
  readonly #boxHeaderId = inject(SKY_BOX_HEADER_ID);
}
