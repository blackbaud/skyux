import { Component } from '@angular/core';
import { SkyHelpInlineModule } from '@skyux/help-inline';
import {
  SkyPopoverMessage,
  SkyPopoverMessageType,
  SkyPopoverModule,
} from '@skyux/popovers';

import { Subject } from 'rxjs';

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  imports: [SkyHelpInlineModule, SkyPopoverModule],
})
export class DemoComponent {
  protected popoverController = new Subject<SkyPopoverMessage>();

  #popoverOpen = false;

  protected onPopoverStateChange(isOpen: boolean): void {
    this.#popoverOpen = isOpen;
  }

  protected openPopover(): void {
    if (!this.#popoverOpen) {
      this.#sendMessage(SkyPopoverMessageType.Open);
    }
  }

  #sendMessage(type: SkyPopoverMessageType): void {
    const message: SkyPopoverMessage = { type };
    this.popoverController.next(message);
  }
}
