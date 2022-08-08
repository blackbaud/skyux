import { Component } from '@angular/core';
import { SkyOverlayService } from '@skyux/core';

import { OverlayHarnessTestContentsComponent } from './overlay-harness-test-contents.component';

@Component({
  selector: 'test-overlay-harness',
  templateUrl: './overlay-harness-test.component.html',
})
export class OverlayHarnessTestComponent {
  #overlayService: SkyOverlayService;

  constructor(overlayService: SkyOverlayService) {
    this.#overlayService = overlayService;
  }

  public openOverlay() {
    const overlay = this.#overlayService.create();
    const instance = overlay.attachComponent(
      OverlayHarnessTestContentsComponent
    );

    return instance;
  }
}
