import { Component } from '@angular/core';
import { SkyOverlayInstance, SkyOverlayService } from '@skyux/core';

import { OverlayContentsTestComponent } from './overlay-contents.component';

@Component({
  selector: 'test-overlay-harness',
  templateUrl: './overlay-harness-test.component.html',
  standalone: false,
})
export class OverlayHarnessTestComponent {
  #overlayService: SkyOverlayService;

  constructor(overlayService: SkyOverlayService) {
    this.#overlayService = overlayService;
  }

  public openOverlay(): SkyOverlayInstance {
    const overlay = this.#overlayService.create();

    overlay.attachComponent(OverlayContentsTestComponent);

    return overlay;
  }
}
